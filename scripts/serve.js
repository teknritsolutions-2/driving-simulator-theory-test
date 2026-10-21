import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const distDir = path.resolve(process.cwd(), "dist");
const port = 4173;

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  let filePath = path.join(distDir, urlPath);

  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    } else if (!path.extname(filePath) && fs.existsSync(filePath + ".html")) {
      filePath = filePath + ".html";
    }
  } catch {
    // Ignore stat errors, handle in fs.stat below
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stats.size,
      "Cache-Control": "no-cache",
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Server listening on http://127.0.0.1:${port}`);
});
