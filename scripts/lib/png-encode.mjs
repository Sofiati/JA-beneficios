/**
 * Encoder PNG mínimo, sem dependências externas.
 *
 * Gera PNG válido (bit depth 8, color type 2 = RGB, sem entrelaçamento)
 * a partir de pixels RGB Uint8Array (3 bytes por pixel).
 *
 * Usa filtro 0 (sem filtro) em todas as scanlines e deflate via node:zlib.
 */

import { deflateSync } from "node:zlib";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function crc32(buf) {
  // CRC-32 (ISO 3309, same as PNG/zlib)
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])) >>> 0, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

/**
 * Codifica pixels RGB em um buffer PNG.
 *
 * @param {Uint8Array} pixels - 3 bytes por pixel (R, G, B)
 * @param {number} width
 * @param {number} height
 * @returns {Buffer} buffer PNG completo
 */
export function encodePng(pixels, width, height) {
  const stride = width * 3;
  const rows = [];
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * stride;
    const row = new Uint8Array(stride + 1);
    row[0] = 0; // filtro 0
    for (let x = 0; x < stride; x += 1) {
      row[x + 1] = pixels[rowStart + x];
    }
    rows.push(Buffer.from(row));
  }
  const raw = Buffer.concat(rows);
  const idat = deflateSync(raw, { level: 6 });

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  return Buffer.concat([
    PNG_SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
