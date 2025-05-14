// /api/replicate/status/[id].mjs - Check Prediction Status
import Replicate from "replicate";

export default async function handler(req, res) {
  const { id } = req.query;

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const prediction = await replicate.predictions.get(id);
    return res.status(200).json(prediction);
  } catch (error) {
    console.error("Error fetching prediction:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
