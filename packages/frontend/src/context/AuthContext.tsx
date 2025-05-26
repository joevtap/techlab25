import type { Session } from '@/types/session';
import { createContext } from 'react';

export const AuthContext = createContext<{
  session?: Session;
  onSignIn: (session: Session) => void;
  onSignOut: () => void;
}>({
  onSignIn: () => {},
  onSignOut: () => {},
});
