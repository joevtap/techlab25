import { useContext } from 'react';
import { SelectedAccountContext } from '@/context/SelectedAccount/SelectedAccountContext';

export function useSelectedAccount() {
  return useContext(SelectedAccountContext);
}
