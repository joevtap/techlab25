import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';

export function useAuth() {
  return useContext(AuthContext);
}
