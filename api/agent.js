export default function handler(req, res) {
  res.status(200).json({
    status: "online",
    capabilities: ["spell-casting", "real-time-automation"]
  });
}
