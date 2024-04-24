import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const tokenFromEnv = process.env.CLOUDFLARE_ACCESS_TOKEN;
const authorizedUsers = (process.env.GITHUB_USERS_AUTHORIZED || '').split(',');

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method "${req.method}" Not Allowed` });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.name) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!authorizedUsers.includes(session.user.name)) {
    return res.status(403).json({ error: `User ${session.user.name} does not have access permission` });
  }

  const authorization = `Bearer ${tokenFromEnv}`;

  try {
    const result = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      body: JSON.stringify(req.body),
    });

    if (!result.ok) {
      return res.status(result.status).json({ error: await result.text() });
    }

    res.setHeader('Content-Type', 'application/json');

    const writable = new WritableStream({
      write(chunk) {
        res.write(chunk);
      },
      close() {
        res.end();
      },
    });

    result.body.pipeTo(writable);
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}
