import { useState, useEffect } from 'react';

interface ClientPrincipal {
  identityProvider: string;
  userId: string;
  userDetails: string;
  userRoles: string[];
  accessToken?: string;
}

interface AuthState {
  user: ClientPrincipal | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    fetch('/.auth/me')
      .then((r) => r.json() as Promise<{ clientPrincipal: ClientPrincipal | null }>)
      .then(({ clientPrincipal }) => setState({ user: clientPrincipal, loading: false }))
      .catch(() => setState({ user: null, loading: false }));
  }, []);

  return state;
}
