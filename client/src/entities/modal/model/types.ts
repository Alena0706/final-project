export type ModalType = 'createFranchise' | 'editFranchise' | 'deleteFranchise' | null;

export interface ModalState {
  isOpen: boolean;
  type: ModalType;
  data?: any; // Для передачи дополнительных данных в модальное окно
}

export interface OpenModalPayload {
  type: ModalType;
  data?: any;
}
