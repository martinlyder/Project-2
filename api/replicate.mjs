// /api/replicate.mjs - Full ESM Setup using Replicate Node SDK (Async)
import Replicate from "replicate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Manually parse the request body
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }
  
  const { message, model } = JSON.parse(body);

  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const input = {
      prompt: message,
      ...model.parameters
    };

    // Start an asynchronous prediction
    const prediction = await replicate.predictions.create({
      version: model.id,
      input: input,
    });

    // Return the prediction ID immediately
    return res.status(200).json({ predictionId: prediction.id });
  } catch (error) {
    console.error("Error with Replicate API:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
