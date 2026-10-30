import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import faqSource from "./src/faq.json";

// Mantém /faq.json disponível sem importar arquivos de public/ nem duplicar a base.
function faqPublicUrl(): Plugin {
  return {
    name: "faq-public-url",
    configureServer(server) {
      server.middlewares.use("/faq.json", (_request, response) => {
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.setHeader("Cache-Control", "no-cache");
        response.end(JSON.stringify(faqSource));
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "faq.json", source: JSON.stringify(faqSource) });
    },
  };
}

export default defineConfig({
  plugins: [react(), faqPublicUrl()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    open: false,
    allowedHosts: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
