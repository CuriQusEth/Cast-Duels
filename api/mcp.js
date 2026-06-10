export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

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
      "name": "castSpell",
      "description": "Casts a spell combination in the arena",
      "inputSchema": {
        "type": "object",
        "properties": {
          "elements": { 
            "type": "array", 
            "items": { "type": "string" } 
          }
        },
        "required": ["elements"]
      }
    },
    {
      "name": "queryStats",
      "description": "Gets the current wizard duelist rating",
      "inputSchema": {
        "type": "object",
        "properties": {}
      }
    }
  ];

  const prompts = [
    {
      "name": "strategyAdvice",
      "description": "Get strategy advice against certain elements",
      "arguments": [
        {
          "name": "enemyElements",
          "description": "Array of enemy elements as a string",
          "required": true
        }
      ]
    }
  ];

  const resources = [
    {
      "uri": "guide://elemental-counters",
      "name": "Element Guide",
      "description": "Guide indicating which elements counter each other",
      "mimeType": "text/plain"
    }
  ];

  if (req.method === "GET") {
    return res.status(200).json({
      "tools": tools,
      "prompts": prompts,
      "resources": resources
    });
  }

  if (req.method === "POST") {
    const body = req.body || {};
    const method = body.method;
    const id = body.id;

    let result = {};

    if (method === "tools/list") {
      result = { tools };
    } else if (method === "prompts/list") {
      result = { prompts };
    } else if (method === "resources/list") {
      result = { resources };
    } else {
      result = {};
    }

    return res.status(200).json({
      jsonrpc: "2.0",
      id: id || null,
      result: result
    });
  }

  res.status(405).json({ error: "Method Not Allowed" });
}
