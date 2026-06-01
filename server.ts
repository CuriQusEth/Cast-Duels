import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Serve MCP endpoint
  app.all("/api/mcp", async (req, res) => {
    try {
      const handler = await import("./api/mcp.js");
      handler.default(req, res);
    } catch(e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/api/agent", (req, res) => {
    res.json({
      status: "online",
      capabilities: ["spell-casting", "real-time-automation"]
    });
  });

  // Vercel deployment fallback for .well-known
  app.get("/.well-known/agent-card.json", async (req, res) => {
    try {
      const handler = await import("./api/agent-card.js");
      handler.default(req, res);
    } catch(e) {
      res.sendFile(path.join(process.cwd(), 'public/.well-known/agent-card.json'));
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Note: ensure we serve public directory if needed
    app.use(express.static(path.join(process.cwd(), 'public')));
    
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
