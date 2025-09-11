import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalState, OpenModalPayload } from './types';

const initialState: ModalState = {
  isOpen: false,
  type: null,
  data: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<OpenModalPayload>) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.data = action.payload.data || null;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = null;
      state.data = null;
    },
    setModalData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
  },
});

export const { openModal, closeModal, setModalData } = modalSlice.actions;
export default modalSlice.reducer;
