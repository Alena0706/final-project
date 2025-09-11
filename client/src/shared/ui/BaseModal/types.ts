import { ReactNode } from 'react';

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
  contentClassName?: string;
}

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
