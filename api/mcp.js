export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Handle standard MCP SSE initialization if requested
  if (req.method === "GET" && req.headers.accept && req.headers.accept.includes("text/event-stream")) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");
    res.write("event: endpoint\n");
    res.write(`data: /api/mcp\n\n`);
    return res.end();
  }

  res.setHeader("Content-Type", "application/json");

  const tools = [
    {
      name: "castSpell",
      description: "Casts a spell combination in the wizard dueling arena",
      inputSchema: {
        type: "object",
        properties: {
          elements: { 
            type: "array", 
            items: { type: "string" },
            description: "List of elemental components (FIRE, FROST, ARCANE, LIGHTNING)"
          }
        },
        required: ["elements"]
      }
    },
    {
      name: "queryStats",
      description: "Gets the current wizard duelist rating, streak, and Base Mainnet status",
      inputSchema: {
        type: "object",
        properties: {}
      }
    },
    {
      name: "getDenimNetworkInfo",
      description: "Returns official Base Mainnet Denim upgrade status (200ms canonical blocks, zero flashblocks)",
      inputSchema: {
        type: "object",
        properties: {}
      }
    }
  ];

  const prompts = [
    {
      name: "strategyAdvice",
      description: "Get strategy advice against certain elemental combinations",
      arguments: [
        {
          name: "enemyElements",
          description: "Array of enemy elements as a string",
          required: true
        }
      ]
    },
    {
      name: "denimOptimizationAdvice",
      description: "Get recommendations for executing transactions on Base Mainnet post-Denim 200ms blocks",
      arguments: []
    }
  ];

  const resources = [
    {
      uri: "guide://elemental-counters",
      name: "Element Counter Guide",
      description: "Guide indicating which elements counter each other",
      mimeType: "text/plain"
    },
    {
      uri: "guide://denim-specifications",
      name: "Base Denim 200ms Migration Guide",
      description: "Specification guide for Base Mainnet Denim canonical 200ms block architecture",
      mimeType: "text/plain"
    }
  ];

  // If it's a GET request, return all capabilities
  if (req.method === "GET") {
    return res.status(200).json({
      protocolVersion: "2024-11-05",
      serverInfo: {
        name: "cast-spell-wizard-duels",
        version: "1.0.0"
      },
      capabilities: {
        tools: { listChanged: false },
        prompts: { listChanged: false },
        resources: { subscribe: false, listChanged: false }
      },
      tools,
      prompts,
      resources,
      denim: {
        network: "Base Mainnet",
        chainId: 8453,
        blockTimeMs: 200,
        flashblocksRetired: true
      }
    });
  }

  // Handle JSON-RPC 2.0 requests
  if (req.method === "POST") {
    const body = req.body || {};
    const method = body.method;
    const id = body.id !== undefined ? body.id : null;

    // MCP initialization handshake
    if (method === "initialize") {
      return res.status(200).json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: body.params?.protocolVersion || "2024-11-05",
          capabilities: {
            tools: { listChanged: false },
            prompts: { listChanged: false },
            resources: { subscribe: false, listChanged: false }
          },
          serverInfo: {
            name: "cast-spell-wizard-duels",
            version: "1.0.0"
          }
        }
      });
    }

    if (method === "notifications/initialized") {
      return res.status(200).json({ jsonrpc: "2.0" });
    }

    if (method === "ping") {
      return res.status(200).json({ jsonrpc: "2.0", id, result: {} });
    }

    if (method === "tools/list") {
      return res.status(200).json({
        jsonrpc: "2.0",
        id,
        result: { tools }
      });
    }

    if (method === "prompts/list") {
      return res.status(200).json({
        jsonrpc: "2.0",
        id,
        result: { prompts }
      });
    }

    if (method === "resources/list") {
      return res.status(200).json({
        jsonrpc: "2.0",
        id,
        result: { resources }
      });
    }

    if (method === "tools/call") {
      const toolName = body.params?.name;
      const args = body.params?.arguments || {};

      if (toolName === "getDenimNetworkInfo") {
        return res.status(200).json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  network: "Base Mainnet",
                  chainId: 8453,
                  upgrade: "Denim",
                  blockTimeMs: 200,
                  canonicalBlocks: true,
                  flashblocksRetired: true,
                  activationDate: "November 5, 2026 18:00 UTC",
                  status: "ACTIVE"
                }, null, 2)
              }
            ]
          }
        });
      }

      if (toolName === "castSpell") {
        const elements = args.elements || [];
        return res.status(200).json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: `Cast spell combination [${elements.join(" + ")}] dealing lethal elemental damage. Confirmed in Base Denim 200ms canonical block.`
              }
            ]
          }
        });
      }

      if (toolName === "queryStats") {
        return res.status(200).json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  rating: 1950,
                  streak: 7,
                  rank: "Grand Archmage",
                  network: "Base Mainnet (Denim)",
                  confirmationTime: "200ms"
                }, null, 2)
              }
            ]
          }
        });
      }

      return res.status(200).json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: `Executed ${toolName}` }]
        }
      });
    }

    // Default fallback
    return res.status(200).json({
      jsonrpc: "2.0",
      id,
      result: {
        tools,
        prompts,
        resources
      }
    });
  }

  res.status(405).json({ error: "Method Not Allowed" });
}
