import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { build, createLogger, createServer } from "vite";

const expected = JSON.parse(readFileSync(new URL("../src/faq.json", import.meta.url), "utf8"));

test("Vite serve os módulos da FAQ e mantém /faq.json no desenvolvimento", async () => {
  const messages = [];
  const logger = createLogger("silent");
  logger.warn = (message) => messages.push(message);
  logger.error = (message) => messages.push(message);
  const server = await createServer({
    customLogger: logger,
    server: { host: "127.0.0.1", port: 5189, open: false },
  });
  try {
    await server.listen();
    const address = server.httpServer.address();
    assert.ok(address && typeof address !== "string");
    const base = `http://127.0.0.1:${address.port}`;
    for (const path of ["/src/faq.ts", "/src/faq.json?import"]) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200, path);
      assert.doesNotMatch(await response.text(), /Assets in public directory cannot be imported/);
    }
    const response = await fetch(base + "/faq.json");
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /application\/json/);
    assert.deepEqual(await response.json(), expected);
    assert.deepEqual(messages, []);
  } finally {
    await server.close();
  }
});

test("build publica /faq.json com a mesma fonte da aplicação e do Worker", async () => {
  const output = await build({ build: { write: false }, logLevel: "silent" });
  assert.ok(!Array.isArray(output) && "output" in output);
  const asset = output.output.find((item) => item.type === "asset" && item.fileName === "faq.json");
  assert.ok(asset);
  assert.deepEqual(JSON.parse(String(asset.source)), expected);
});
