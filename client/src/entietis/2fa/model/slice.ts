import { createSlice } from '@reduxjs/toolkit';
import type { TwoFactorStateT } from './types';
import { register2FA } from './thunks';

const initialState: TwoFactorStateT = {
  user: null,
  status: 'loading',
  error: null,
  secret: null,
};

export const twoFactorSlice = createSlice({
  name: 'twoFactor',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(register2FA.fulfilled, (state, action) => {
        state.secret = action.payload;

        console.log(action.payload);
      })
      .addCase(register2FA.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unknown error';
        console.log(state.error);
      })
      .addCase(register2FA.pending, (state) => {
        state.error = null;
      });
  },
});

export default twoFactorSlice.reducer;
