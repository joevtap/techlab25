import { createContext } from 'react';

export type ModalItem = {
  id: string;
  component: React.ReactElement;
};

export type ModalType = 'CREATE_ACCOUNT';

export const ModalsContext = createContext<{
  modals: ModalItem[];
  openModal: (modalType: ModalType, props?: Record<string, unknown>) => string;
  closeModal: (id: string) => void;
}>({
  modals: [],
  openModal: () => '',
  closeModal: () => {},
});
