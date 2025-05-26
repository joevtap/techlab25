import { useAuth } from './useAuth';

export function useAuthenticatedRequest() {
  const { session, onSignOut } = useAuth();

  const authFetch = async (
    input: string | URL | globalThis.Request,
    init?: RequestInit,
  ) => {
    const requestInit: RequestInit = {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${session?.token}`,
      },
    };

    const res = await fetch(input, requestInit);

    if (res.status === 401 || res.status === 403) {
      onSignOut();
    }

    return res;
  };

  return authFetch;
}
