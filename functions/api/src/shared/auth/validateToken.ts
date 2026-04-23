import { HttpRequest } from '@azure/functions';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  displayName: string;
}

interface ClientPrincipalClaim {
  typ: string;
  val: string;
}

interface ClientPrincipal {
  identityProvider: string;
  userId: string;
  userDetails: string;
  userRoles: string[];
  claims: ClientPrincipalClaim[];
}

export async function validateToken(req: HttpRequest): Promise<AuthenticatedUser> {
  const header = req.headers.get('x-ms-client-principal');
  if (!header) {
    throw new Error('Not authenticated');
  }

  const decoded = Buffer.from(header, 'base64').toString('utf-8');
  const principal: ClientPrincipal = JSON.parse(decoded);

  if (!principal.userId) {
    throw new Error('Invalid client principal');
  }

  const getClaim = (type: string): string =>
    principal.claims?.find((c) => c.typ === type)?.val ?? '';

  return {
    userId: principal.userId,
    email: getClaim('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress') || principal.userDetails,
    displayName: getClaim('name') || principal.userDetails,
  };
}
