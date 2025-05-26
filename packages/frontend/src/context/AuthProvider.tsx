import { AuthContext } from './AuthContext';
import type React from 'react';
import { useNavigate } from 'react-router';
import type { Session } from '@/types/session';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export function AuthProvider({ children }: { children: React.ReactElement }) {
  const [session, setSession] = useLocalStorage('session', null);
  const navigate = useNavigate();

  const onSignIn = (_session: Session) => {
    setSession(_session);
    navigate('/');
  };

  const onSignOut = () => {
    setSession(undefined);
    navigate('/sign-in');
  };

  return (
    <AuthContext.Provider value={{ session, onSignIn, onSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}
