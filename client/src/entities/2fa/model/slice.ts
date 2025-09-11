import { createSlice } from '@reduxjs/toolkit';
import { register2FA, verify2FA, disable2FA, verify2FALogin } from './thunks';

type TwoFactorStateT = {
  secret: string | null;
  url: string | null;
  isEnabled: boolean;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
};

const initialState: TwoFactorStateT = {
  secret: null,
  url: null,
  isEnabled: false,
  isVerified: false,
  isLoading: false,
  error: null,
  successMessage: null,
};

export const twoFactorSlice = createSlice({
  name: 'twoFactor',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    reset2FAState: (state) => {
      state.secret = null;
      state.url = null;
      state.isEnabled = false;
      state.isVerified = false;
      state.error = null;
      state.successMessage = null;
    },
    set2FAStatus: (state, action) => {
      const { isEnabled, secret } = action.payload;
      state.isEnabled = isEnabled;
      if (secret) {
        state.secret = secret;
      }
    },
  },
  extraReducers(builder) {
    builder
      // Register 2FA
      .addCase(register2FA.fulfilled, (state, action) => {
        state.secret = action.payload.secret;
        state.url = action.payload.otpauth_url;
        state.isLoading = false;
        state.error = null;
        console.log(action.payload);
      })
      .addCase(register2FA.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка при генерации 2FA';
        state.isLoading = false;
        console.log(state.error);
      })
      .addCase(register2FA.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      // Verify 2FA
      .addCase(verify2FA.fulfilled, (state, action) => {
        state.isVerified = action.payload.verified;
        state.isEnabled = action.payload.verified;
        state.isLoading = false;
        state.error = null;
        state.successMessage = action.payload.message;
      })
      .addCase(verify2FA.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка при верификации 2FA';
        state.isLoading = false;
      })
      .addCase(verify2FA.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      // Disable 2FA
      .addCase(disable2FA.fulfilled, (state) => {
        state.isEnabled = false;
        state.isVerified = false;
        state.secret = null;
        state.url = null;
        state.isLoading = false;
        state.error = null;
        state.successMessage = '2FA успешно отключен';
      })
      .addCase(disable2FA.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка при отключении 2FA';
        state.isLoading = false;
      })
      .addCase(disable2FA.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      // Verify 2FA Login
      .addCase(verify2FALogin.fulfilled, (state) => {
        state.isVerified = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(verify2FALogin.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка при верификации 2FA для входа';
        state.isLoading = false;
      })
      .addCase(verify2FALogin.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      });
  },
});

export const { clearError, clearSuccessMessage, reset2FAState, set2FAStatus } =
  twoFactorSlice.actions;
export default twoFactorSlice.reducer;
