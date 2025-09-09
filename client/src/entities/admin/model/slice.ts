import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type AdminState = {
  admin: boolean;
};

const initialState: AdminState = {
  admin: false,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<boolean | undefined>) => {
      state.admin = action.payload ?? false;
    },
  },
});

export default adminSlice.reducer;

export const { setAdmin } = adminSlice.actions;
