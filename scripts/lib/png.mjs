/**
 * Decodificador PNG mínimo, sem dependências externas.
 *
 * Suporta apenas o subconjunto presente nos assets do projeto:
 * bit depth 8, color type 2 (RGB) ou 6 (RGBA), sem entrelaçamento (Adam7).
 * O chunk `caBX` (metadados do Caïro) é ignorado — não affects os pixels.
 */

import { inflateSync } from "node:zlib";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** Canais por color type do PNG. */
const CHANNELS = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

/**
 * Aplica a reconstrução de cada scanline (filtros PNG 0-4) sobre os dados
 * descomprimidos, devolvendo os pixels em RGB (alpha descartado).
 *
 * @param {Buffer} raw dados de IDAT já inflados
 * @param {number} width
 * @param {number} height
 * @param {number} channels
 * @returns {Uint8Array} pixels RGB, 3 bytes por pixel
 */
function unfilter(raw, width, height, channels) {
  const stride = width * channels;
  const out = new Uint8Array(stride * height);
  let pos = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = raw[pos];
    pos += 1;
    const rowStart = y * stride;
    const prevStart = rowStart - stride;

    for (let x = 0; x < stride; x += 1) {
      const rawByte = raw[pos + x];
      const left = x >= channels ? out[rowStart + x - channels] : 0;
      const up = y > 0 ? out[prevStart + x] : 0;
      const upLeft = y > 0 && x >= channels ? out[prevStart + x - channels] : 0;

      let value;
      switch (filter) {
        case 0:
          value = rawByte;
          break;
        case 1:
          value = rawByte + left;
          break;
        case 2:
          value = rawByte + up;
          break;
        case 3:
          value = rawByte + ((left + up) >> 1);
          break;
        case 4:
          value = rawByte + paeth(left, up, upLeft);
          break;
        default:
          throw new Error(`Filtro PNG desconhecido: ${filter}`);
      }
      out[rowStart + x] = value & 0xff;
    }
    pos += stride;
  }
  return out;
}

/** Preditor Paeth do PNG (spec 9.2.6). */
function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) {
    return a;
  }
  return pb <= pc ? b : c;
}

/**
 * Lê um PNG e devolve seus pixels em RGB.
 *
 * @param {Buffer} buffer conteúdo binário do arquivo
 * @returns {{ width: number, height: number, pixels: Uint8Array }}
 */
export function decodePng(buffer) {
  if (!buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error("Arquivo não é um PNG válido (assinatura inválida).");
  }

  let offset = 8;
  let header = null;
  const idatParts = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);

    if (type === "IHDR") {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        depth: data[8],
        colorType: data[9],
        interlace: data[12],
      };
    } else if (type === "IDAT") {
      idatParts.push(data);
    } else if (type === "IEND") {
      break;
    }
    offset += 12 + length;
  }

  if (!header) {
    throw new Error("PNG sem chunk IHDR.");
  }
  if (header.depth !== 8) {
    throw new Error(`Bit depth ${header.depth} não suportado (esperado 8).`);
  }
  if (header.interlace !== 0) {
    throw new Error("PNG entrelaçado (Adam7) não suportado.");
  }
  const channels = CHANNELS[header.colorType];
  if (!channels) {
    throw new Error(`Color type ${header.colorType} não suportado.`);
  }

  const raw = inflateSync(Buffer.concat(idatParts));
  const decoded = unfilter(raw, header.width, header.height, channels);

  // Normaliza para RGB (descarta alpha ou grayscale).
  const { width, height } = header;
  const pixels = new Uint8Array(width * height * 3);
  for (let i = 0; i < width * height; i += 1) {
    const src = i * channels;
    const dst = i * 3;
    if (channels >= 3) {
      pixels[dst] = decoded[src];
      pixels[dst + 1] = decoded[src + 1];
      pixels[dst + 2] = decoded[src + 2];
    } else {
      pixels[dst] = decoded[src];
      pixels[dst + 1] = decoded[src];
      pixels[dst + 2] = decoded[src];
    }
  }
  return { width, height, pixels };
}
