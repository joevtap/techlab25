import { AuthContext } from '@/context/Auth/AuthContext';
import { useContext } from 'react';

export function useAuth() {
  return useContext(AuthContext);
}
