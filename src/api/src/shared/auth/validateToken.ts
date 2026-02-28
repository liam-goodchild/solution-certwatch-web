import { HttpRequest } from '@azure/functions';
import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  userId: string; // Entra 'oid' claim
  email: string;
  displayName: string;
}

const jwksUri = process.env['ENTRA_JWKS_URI']!;
const audience = process.env['ENTRA_AUDIENCE']!;

const client = jwksClient({
  jwksUri,
  cache: true,
  cacheMaxAge: 600_000, // 10 minutes
  rateLimit: true,
});

function getSigningKey(header: jwt.JwtHeader): Promise<string> {
  return new Promise((resolve, reject) => {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) return reject(err);
      resolve(key!.getPublicKey());
    });
  });
}

export async function validateToken(req: HttpRequest): Promise<AuthenticatedUser> {
  const authHeader = req.headers.get('authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or malformed Authorization header');
  }

  const token = authHeader.slice(7);
  const decoded = jwt.decode(token, { complete: true });
  if (!decoded || typeof decoded === 'string' || !decoded.header) {
    throw new Error('Invalid token format');
  }

  const signingKey = await getSigningKey(decoded.header);

  const payload = jwt.verify(token, signingKey, {
    audience,
    algorithms: ['RS256'],
  }) as jwt.JwtPayload;

  const userId = payload['oid'] as string | undefined;
  if (!userId) throw new Error('Token missing oid claim');

  return {
    userId,
    email: (payload['email'] ?? payload['preferred_username'] ?? '') as string,
    displayName: (payload['name'] ?? '') as string,
  };
}
