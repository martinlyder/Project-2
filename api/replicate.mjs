// /api/replicate.mjs - Full ESM Setup using Replicate Node SDK
import Replicate from "replicate";

export default async function handler(req, res) {

  const { message, model } = JSON.parse(body);

  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const input = {
      prompt: message,
      ...model.parameters
    };

    const output = await replicate.run(model.id, { input });
    
    return output.join("");

  } catch (error) {
    console.error("Error with Replicate API:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
