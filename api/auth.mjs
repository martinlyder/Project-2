export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get credentials from environment variables
  const validUsername = process.env.LOGIN_NAME;
  const validPassword = process.env.PASSWORD;

  // Parse request body
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }
  const { username, password } = JSON.parse(body);

  // Check credentials
  if (username === validUsername && password === validPassword) {
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
}