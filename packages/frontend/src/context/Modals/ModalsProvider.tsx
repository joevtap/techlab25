import React from 'react';
import { ModalsContext, type ModalItem, type ModalType } from './ModalsContext';
import { CreateAccountModal } from '@/components/CreateAccountModal';

interface ModalProps {
  modalId: string;
  [key: string]: unknown;
}

const modalComponents: Record<ModalType, React.ComponentType<ModalProps>> = {
  CREATE_ACCOUNT: CreateAccountModal,
};

export function ModalsProvider({ children }: { children: React.ReactElement }) {
  const [modals, setModals] = React.useState<ModalItem[]>([]);

  const openModal = (
    modalType: ModalType,
    props: Record<string, unknown> = {},
  ): string => {
    const id = crypto.randomUUID();

    const ModalComponent = modalComponents[modalType];

    if (!ModalComponent) {
      console.error(`Modal type "${modalType}" not found in registry`);
      return '';
    }

    const modalWithProps = <ModalComponent modalId={id} {...props} />;

    setModals((prev) => [...prev, { id, component: modalWithProps }]);
    return id;
  };

  const closeModal = (id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  };

  return (
    <ModalsContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
      {modals.map((modal) => (
        <React.Fragment key={modal.id}>{modal.component}</React.Fragment>
      ))}
    </ModalsContext.Provider>
  );
}
