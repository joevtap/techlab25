import { ModalsContext } from '@/context/Modals/ModalsContext';
import { useContext } from 'react';

export function useModal() {
  return useContext(ModalsContext);
}
