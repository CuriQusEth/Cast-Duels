export default function handler(req, res) {
  res.status(200).json({
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
}
