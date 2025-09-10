import { createSlice } from '@reduxjs/toolkit';
import type { UserStateT } from './types';
import type { userRegister2faSchemaT } from '@/entities/2fa/model/types';
import {
  loginUser,
  logoutUser,
  refreshUser,
  registerUser,
  updateUser,
  uploadAvatar,
  verify2FA,
  generate2FASecret,
  verify2FAToken,
  disable2FA,
} from './thunks';

const initialState: UserStateT = {
  user: null,
  status: 'guest',
  error: null,
  secret: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
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
        if (action.payload?.user && state.user?.user) {
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
        console.log('Login fulfilled - setting user data:', action.payload);
        console.log('User admin flag:', action.payload?.user?.admin);
        console.log('User admin type:', typeof action.payload?.user?.admin);
        state.user = action.payload;
        state.status = 'logged';
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
          const axiosError = action.error as any;
          if (axiosError.response?.data?.message) {
            state.error = axiosError.response.data.message;
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
        state.status = 'loading';
        state.error = null;
      });
    builder
      .addCase(verify2FA.fulfilled, (state, action) => {
        state.status = 'logged';
        state.user = action.payload;
      })
      .addCase(verify2FA.rejected, (state, action) => {
        state.status = 'guest';
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(verify2FA.pending, (state) => {
        state.error = null;
        state.status = 'loading';
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

    // 2FA handlers
    builder
      .addCase(generate2FASecret.fulfilled, (state, action) => {
        state.secret = action.payload as userRegister2faSchemaT;
        state.error = null;
      })
      .addCase(generate2FASecret.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unknown error';
      });

    builder
      .addCase(verify2FAToken.fulfilled, (state) => {
        state.error = null;
        // Можно добавить дополнительную логику при успешной проверке
      })
      .addCase(verify2FAToken.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unknown error';
      });

    builder
      .addCase(disable2FA.fulfilled, (state) => {
        state.secret = null;
        state.error = null;
        // Обновляем пользователя, убирая secret
        if (state.user?.user) {
          state.user.user.secret = null;
        }
      })
      .addCase(disable2FA.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export default userSlice.reducer;
