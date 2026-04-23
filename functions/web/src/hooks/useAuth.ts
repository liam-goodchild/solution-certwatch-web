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
  error: string | null;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, error: null });

  useEffect(() => {
    fetch('/.auth/me')
      .then((r) => {
        if (!r.ok) throw new Error(`Auth endpoint returned ${r.status}`);
        return r.json() as Promise<{ clientPrincipal: ClientPrincipal | null }>;
      })
      .then(({ clientPrincipal }) =>
        setState({ user: clientPrincipal, loading: false, error: null })
      )
      .catch((err) =>
        setState({ user: null, loading: false, error: err.message ?? 'Auth check failed' })
      );
  }, []);

  return state;
}
