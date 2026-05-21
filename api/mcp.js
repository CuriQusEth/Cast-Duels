export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  res.status(200).json({
    "tools": [
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
    ],
    "prompts": [
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
    ],
    "resources": [
      {
        "uri": "guide://elemental-counters",
        "name": "Element Guide",
        "description": "Guide indicating which elements counter each other",
        "mimeType": "text/plain"
      }
    ]
  });
}
