import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  EmailVerificationT,
  ResendVerificationT,
  UserLoginT,
  UserRegisterT,
  UserUpdateT,
} from './types';
import UserServices from '../api/userServices';
import { setAccessToken, removeAccessToken, forceRefreshTokens } from '@/shared/api/axiosInstance';
import { clearMessages, joinRoom } from '@/entities/chat/model/slice';
import { set2FAStatus } from '@/entities/2fa/model/slice';

type verify2FAT = {
  token: string;
  email: string | undefined;
};

export const updateUser = createAsyncThunk('user/updateUser', async (user: UserUpdateT, { dispatch }) => {
  const update = await UserServices.updateUser(user);
  
  // Обновляем статус 2FA если пользователь изменился
  if (update.user?.secret) {
    dispatch(set2FAStatus({ isEnabled: true, secret: update.user.secret }));
    console.log('✅ Статус 2FA обновлен после изменения пользователя');
  }
  
  return update;
});

export const registerUser = createAsyncThunk('user/register', async (user: UserRegisterT) => {
  const response = await UserServices.register(user);
  if (response.accessToken) {
    setAccessToken(response.accessToken);
  }
  return response;
});

export const uploadAvatar = createAsyncThunk<{ user: { avatar: string } }, FormData>(
  'user/uploadAvatar',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const result = await UserServices.uploadAvatar(formData);
      return result as { user: { avatar: string } };
    } catch (error: any) {
      // Если получили 401, пытаемся обновить токены и повторить запрос
      if (error?.response?.status === 401) {
        console.log('🔄 Получен 401 при загрузке аватара, пытаемся обновить токены...');
        const refreshSuccess = await forceRefreshTokens();
        if (refreshSuccess) {
          console.log('🔄 Повторяем загрузку аватара с обновленным токеном...');
          try {
            const result = await UserServices.uploadAvatar(formData);
            return result as { user: { avatar: string } };
          } catch (retryError) {
            console.error('❌ Повторная попытка загрузки аватара не удалась:', retryError);
            return rejectWithValue(retryError);
          }
        }
      }
      return rejectWithValue(error);
    }
  },
);

export const loginUser = createAsyncThunk('user/login', async (user: UserLoginT, { dispatch }) => {
  const response = await UserServices.login(user);
  if (response.accessToken) {
    setAccessToken(response.accessToken);
  }
  
  // Обновляем статус 2FA при входе
  if (response.user?.secret) {
    dispatch(set2FAStatus({ isEnabled: true, secret: response.user.secret }));
    console.log('✅ Статус 2FA обновлен при входе');
  }
  
  return response;
});

export const refreshUser = createAsyncThunk('user/refresh', async (_, { dispatch }) => {
  const response = await UserServices.refresh();
  if (response.accessToken) {
    setAccessToken(response.accessToken);
  }
  
  // Обновляем статус 2FA при обновлении токенов
  if (response.user?.secret) {
    dispatch(set2FAStatus({ isEnabled: true, secret: response.user.secret }));
    console.log('✅ Статус 2FA обновлен при обновлении токенов');
  }
  
  return response;
});

export const logoutUser = createAsyncThunk('user/logout', async (_, { dispatch }) => {
  await UserServices.logout();
  removeAccessToken();
  // Очищаем чат при выходе из системы
  dispatch(clearMessages());
  dispatch(joinRoom(''));
});

export const verify2FA = createAsyncThunk(
  'user/verify2FA',
  async ({ token, email }: verify2FAT, { dispatch }) => {
    const response = await UserServices.verify2FA(token, email);
    if (response.accessToken) {
      setAccessToken(response.accessToken);
    }
    
    // Обновляем статус 2FA в Redux store
    if (response.user?.secret) {
      dispatch(set2FAStatus({ isEnabled: true, secret: response.user.secret }));
      console.log('✅ Статус 2FA обновлен в Redux store');
    }
    
    // Принудительно обновляем токены после 2FA верификации
    console.log('🔄 Обновляем токены после 2FA верификации...');
    const refreshSuccess = await forceRefreshTokens();
    if (!refreshSuccess) {
      console.warn('⚠️ Не удалось обновить токены после 2FA верификации');
    }
    
    return response;
  },
);

export const verify2FAToken = createAsyncThunk('user/verify2FAToken', async (token: string) => {
  const response = await UserServices.verify2FAToken(token);
  return response;
});

export const disable2FA = createAsyncThunk('user/disable2FA', async (token: string) => {
  const response = await UserServices.disable2FA(token);
  return response;
});

export const verifyEmail = createAsyncThunk(
  'user/verifyEmail',
  async (data: EmailVerificationT) => {
    const response = await UserServices.verifyEmail(data);
    return response;
  },
);

export const resendVerificationEmail = createAsyncThunk(
  'user/resendVerificationEmail',
  async (data: ResendVerificationT) => {
    const response = await UserServices.resendVerificationEmail(data);
    return response;
  },
);
