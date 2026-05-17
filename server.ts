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
  app.get("/api/mcp", (req, res) => {
    res.json({
      tools: [
        {
          name: "castSpell",
          description: "Casts a spell combination in the arena",
          inputSchema: {
            type: "object",
            properties: {
              elements: { 
                type: "array", 
                items: { type: "string" } 
              }
            }
          }
        },
        {
          name: "queryStats",
          description: "Gets the current wizard duelist rating",
          inputSchema: {
            type: "object",
            properties: {}
          }
        }
      ],
      prompts: [
        {
          name: "strategyAdvice",
          description: "Get strategy advice against certain elements",
          arguments: [
            {
              name: "enemyElements",
              description: "Array of enemy elements as a string",
              required: true
            }
          ]
        }
      ],
      resources: [
        {
          uri: "guide://elemental-counters",
          name: "Element Guide",
          description: "Guide indicating which elements counter each other"
        }
      ]
    });
  });

  app.get("/api/agent", (req, res) => {
    res.json({
      status: "online",
      capabilities: ["spell-casting", "real-time-automation"]
    });
  });

  // Vercel deployment fallback for .well-known
  app.get("/.well-known/agent-card.json", (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/.well-known/agent-card.json'));
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
