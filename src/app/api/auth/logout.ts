import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Revoke the Discord token
  const revokeResponse = await fetch(
    'https://discord.com/api/oauth2/token/revoke',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        token: token.accessToken,
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
      }),
    }
  );

  if (!revokeResponse.ok) {
    return res.status(500).json({ error: 'Failed to revoke Discord token' });
  }

  res.status(200).json({ message: 'Logged out successfully' });
}
