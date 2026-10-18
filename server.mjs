/**
 * Local demonstration server. No login, no persistence and no external API calls.
 * Default bind is localhost; do not expose this server on the Internet.
 */
import http from "node:http";
import {readFile} from "node:fs/promises";
import {PackingError, packOrder, buildPickingList} from "./src/warehouse.mjs";
import {products, boxes, orders} from "./examples/sample-data.mjs";

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4173);

function json(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  res.end(JSON.stringify(data, null, 2));
}

async function readJson(req) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > 256_000) throw new PackingError("JSON request exceeds demo size limit");
    chunks.push(chunk);
  }
  const source = Buffer.concat(chunks).toString("utf8");
  try { return JSON.parse(source || "{}"); }
  catch { throw new PackingError("Request body must contain valid JSON"); }
}

async function html(res, name) {
  const file = name === "shopify" ? "./shopify-demo.html" : "./index.html";
  const source = await readFile(new URL(file, import.meta.url));
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  res.end(source);
}

const server = http.createServer(async (req, res) => {
  try {
    const path = new URL(req.url || "/", "http://localhost").pathname;
    if (req.method === "GET" && (path === "/" || path === "/index.html")) return await html(res, "offline");
    if (req.method === "GET" && path === "/shopify-demo.html") return await html(res, "shopify");
    if (req.method === "GET" && path === "/api/health") {
      return json(res, 200, {status: "ok", mode: "local-demo", externalServicesConnected: false});
    }
    if (req.method === "GET" && path === "/api/sample") {
      return json(res, 200, {products, boxes, orders, sampleData: true});
    }
    if (req.method === "POST" && path === "/api/pack") {
      const body = await readJson(req);
      return json(res, 200, packOrder({
        order: body.order || orders[0],
        products: body.products || products,
        boxes: body.boxes || boxes
      }));
    }
    if (req.method === "POST" && path === "/api/picking") {
      const body = await readJson(req);
      return json(res, 200, buildPickingList({
        orders: body.orders || orders,
        products: body.products || products
      }));
    }
    if (!["GET", "POST"].includes(req.method || "")) return json(res, 405, {error: "Method not allowed"});
    return json(res, 404, {error: "Unknown demo route"});
  } catch (error) {
    if (error instanceof PackingError) return json(res, 400, {error: error.message});
    console.error("Demo server error:", error);
    return json(res, 500, {error: "Internal demo error"});
  }
});

server.listen(port, host, () => {
  console.log("LiberaPack local demo: http://" + host + ":" + port);
  console.log("API: GET /api/health, GET /api/sample, POST /api/pack, POST /api/picking");
});
