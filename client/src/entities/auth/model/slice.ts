import { createSlice } from '@reduxjs/toolkit';
import type { UserStateT } from './types';

import {
  loginUser,
  logoutUser,
  refreshUser,
  registerUser,
  updateUser,
  uploadAvatar,
  verifyEmail,
  resendVerificationEmail,
} from './thunks';
import { verify2FALogin } from '@/entities/2fa/model/thunks';
import { set2FAStatus } from '@/entities/2fa/model/slice';
import { clearMessages, joinRoom } from '@/entities/chat/model/slice';
import type { AxiosError } from 'axios';

const initialState: UserStateT = {
  user: null,
  status: 'guest',
  error: null,
  secret: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'logged';
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.user = null;
        state.status = 'guest';
        // Не показываем ошибки для обычных случаев (нет токена, истек токен)
        if (action.error.name !== `AxiosError`) {
          state.error = action.error.message ?? 'Unknown error';
        } else {
          state.error = null;
        }
      })
      .addCase(refreshUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      });

    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'logged';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.user = null;
        state.status = 'guest';
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      });

    builder
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.error = null;
        // Обновляем аватар пользователя, если он есть в ответе
        if (state.user?.user) {
          state.user.user.avatar = action.payload.user.avatar;
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unknown error';
      });

    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'guest';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
      });

    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload.twoFactorEnabled && action.payload.user.secret) {
          state.secret = {
            secret: action.payload.user.secret,
            otpauth_url: '', // URL будет сгенерирован при запросе
          };
          state.status = 'pending2FA'; // Специальный статус для ожидания 2FA
        } else {
          state.status = 'logged';
        }
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.status = 'guest';
        // Более детальная обработка ошибок
        if (action.payload) {
          state.error = action.payload as string;
        } else if (action.error.message) {
          state.error = action.error.message;
        } else if (action.error.name === 'AxiosError') {
          // Обработка Axios ошибок
          const axiosError = action.error as unknown as AxiosError;
          if (
            axiosError.response?.data &&
            typeof axiosError.response.data === 'object' &&
            'message' in axiosError.response.data
          ) {
            state.error = (axiosError.response.data as { message: string }).message;
          } else if (axiosError.response?.status === 500) {
            state.error = 'Ошибка сервера. Попробуйте позже.';
          } else if (axiosError.response?.status === 401) {
            state.error = 'Неверные данные для входа';
          } else {
            state.error = 'Ошибка сети. Проверьте подключение.';
          }
        } else {
          state.error = 'Ошибка входа в систему';
        }
      })
      .addCase(loginUser.pending, (state) => {
        // state.status = 'loading';
        state.error = null;
      });

    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        if (state.user) {
          state.user = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'guest';
        if (action.error.name !== `AxiosError`) {
          state.error = action.error.message ?? 'Unknown error';
          
        } else {
          state.error = null;
        }
      });

    builder
      .addCase(verifyEmail.fulfilled, (state) => {
        if (state.user?.user) {
          state.user.user.emailVerified = true;
        }
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка подтверждения email';
      });

    builder
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка отправки письма';
      });

    // 2FA Login verification
    builder
      .addCase(verify2FALogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'logged';
        state.error = null;
      })
      .addCase(verify2FALogin.rejected, (state, action) => {
        state.status = 'guest';
        state.error = action.error.message ?? 'Ошибка верификации 2FA';
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
