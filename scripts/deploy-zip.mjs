#!/usr/bin/env node
/**
 * deploy:zip — gera o bundle de produção e empacota em deploy.zip
 *
 * Uso:  npm run deploy:zip
 *
 * O zip contém o CONTEÍDO de dist/ na raiz (index.html, assets/, ...),
 * pronto para extrair direto em public_html via File Manager ou FTP da Hostinger.
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(root, "..");
const distDir = path.join(projectRoot, "dist");
const zipPath = path.join(projectRoot, "deploy.zip");

// 1) Build de produção (tsc --noEmit && vite build)
console.log("▶ Building production bundle...");
execSync("npm run build", { cwd: projectRoot, stdio: "inherit" });

if (!existsSync(path.join(distDir, "index.html"))) {
  console.error("✖ Build não gerou dist/index.html — abortando.");
  process.exit(1);
}

// 2) Zip com o conteúdo de dist/ na raiz
if (existsSync(zipPath)) rmSync(zipPath);

console.log("▶ Criando deploy.zip...");
if (process.platform === "win32") {
  // Compress-Archive não inclui a pasta de origem quando usamos o curinga dist\*
  execFileSync(
    "powershell",
    ["-NoProfile", "-Command", `Compress-Archive -Path "${path.join(distDir, "*")}" -DestinationPath "${zipPath}" -Force`],
    { stdio: "inherit" },
  );
} else {
  execFileSync("zip", ["-r", zipPath, "."], { cwd: distDir, stdio: "inherit" });
}

console.log(`✔ Pronto: ${zipPath}`);
console.log("  Envie o conteúdo do zip para public_html (File Manager ou FTP).");
