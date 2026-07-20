import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const getDirname = () => {
  try {
    return __dirname;
  } catch {
    const __filename = fileURLToPath(import.meta.url);
    return path.dirname(__filename);
  }
};

const currentDir = getDirname();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Serve API routes first
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Determine if we should run in production mode (serving built dist files)
  const isProd = currentDir.includes("dist") || process.env.NODE_ENV === "production";

  if (!isProd) {
    console.log("Starting server in DEVELOPMENT mode with Vite middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode, serving static files...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Explicitly set headers to guarantee correct MIME types
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        const ext = path.extname(filePath).toLowerCase();
        if (ext === ".js" || ext === ".mjs") {
          res.setHeader("Content-Type", "application/javascript; charset=utf-8");
        } else if (ext === ".css") {
          res.setHeader("Content-Type", "text/css; charset=utf-8");
        } else if (ext === ".html") {
          res.setHeader("Content-Type", "text/html; charset=utf-8");
        } else if (ext === ".json") {
          res.setHeader("Content-Type", "application/json; charset=utf-8");
        } else if (ext === ".svg") {
          res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
        } else if (ext === ".png") {
          res.setHeader("Content-Type", "image/png");
        } else if (ext === ".jpg" || ext === ".jpeg") {
          res.setHeader("Content-Type", "image/jpeg");
        }
      }
    }));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
