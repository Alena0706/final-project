import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import { openModal, closeModal, ModalType } from './slice';

export const useModal = () => {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((store) => store.modal);

  const open = (type: ModalType, data?: any) => {
    dispatch(openModal({ type, data }));
  };

  const close = () => {
    dispatch(closeModal());
  };

  const isOpen = (type: ModalType) => {
    return modal.isOpen && modal.type === type;
  };

  return {
    modal,
    open,
    close,
    isOpen,
  };
};
