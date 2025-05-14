// /api/replicate.mjs - Full ESM Setup with Standard Request Handling
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const replicateApiToken = process.env.REPLICATE_API_TOKEN;
  
  if (!replicateApiToken) {
    return res.status(500).json({ error: "API Token not set" });
  }

  // Manually parse the request body
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }
  
  const { message, model } = JSON.parse(body);

  try {
    const input = {
      prompt: message,
      ...model.parameters
    };

    const response = await fetch(`https://api.replicate.com/v1/predictions`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: model.id,
        input
      }),
    });

    if (!response.ok) {
      throw new Error(`Replicate API returned status ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error with Replicate API:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
