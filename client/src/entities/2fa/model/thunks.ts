import { createAsyncThunk } from '@reduxjs/toolkit';
import TwoFactorSecretService from '../api/TwoFactorService';
import { set2FAStatus } from './slice';
import { forceRefreshTokens } from '@/shared/api/axiosInstance';
import { updateUser } from '@/entities/auth/model/thunks';

export const register2FA = createAsyncThunk('twoFactor/register2FA', async (_, { rejectWithValue }) => {
  try {
    const result = await TwoFactorSecretService.register2FA();
    return result;
  } catch (error: any) {
    // Если получили 401, пытаемся обновить токены и повторить запрос
    if (error?.response?.status === 401) {
      console.log('🔄 Получен 401 при регистрации 2FA, пытаемся обновить токены...');
      const refreshSuccess = await forceRefreshTokens();
      if (refreshSuccess) {
        console.log('🔄 Повторяем регистрацию 2FA с обновленным токеном...');
        try {
          const result = await TwoFactorSecretService.register2FA();
          return result;
        } catch (retryError) {
          console.error('❌ Повторная попытка регистрации 2FA не удалась:', retryError);
          return rejectWithValue(retryError);
        }
      }
    }
    return rejectWithValue(error);
  }
});

export const verify2FA = createAsyncThunk('twoFactor/verify2FA', async (token: string, { rejectWithValue, dispatch }) => {
  try {
    const result = await TwoFactorSecretService.verify2FA(token);
    
    // Обновляем статус 2FA в Redux store после успешной верификации
    if (result.verified) {
      dispatch(set2FAStatus({ isEnabled: true, secret: null }));
      console.log('✅ 2FA верифицирован, статус обновлен в Redux store');
    }
    
    return result;
  } catch (error: any) {
    // Если получили 401, пытаемся обновить токены и повторить запрос
    if (error?.response?.status === 401) {
      console.log('🔄 Получен 401 при верификации 2FA, пытаемся обновить токены...');
      const refreshSuccess = await forceRefreshTokens();
      if (refreshSuccess) {
        console.log('🔄 Повторяем верификацию 2FA с обновленным токеном...');
        try {
          const result = await TwoFactorSecretService.verify2FA(token);
          
          // Обновляем статус 2FA в Redux store после успешной верификации
          if (result.verified) {
            dispatch(set2FAStatus({ isEnabled: true, secret: null }));
            console.log('✅ 2FA верифицирован, статус обновлен в Redux store');
          }
          
          return result;
        } catch (retryError) {
          console.error('❌ Повторная попытка верификации 2FA не удалась:', retryError);
          return rejectWithValue(retryError);
        }
      }
    }
    return rejectWithValue(error);
  }
});

export const disable2FA = createAsyncThunk('twoFactor/disable2FA', async (token: string, { rejectWithValue, dispatch }) => {
  try {
    const result = await TwoFactorSecretService.disable2FA(token);
    
    // Обновляем статус 2FA в Redux store после успешного отключения
    dispatch(set2FAStatus({ isEnabled: false, secret: null }));
    console.log('✅ 2FA отключен, статус обновлен в Redux store');
    
    return result;
  } catch (error: any) {
    // Если получили 401, пытаемся обновить токены и повторить запрос
    if (error?.response?.status === 401) {
      console.log('🔄 Получен 401 при отключении 2FA, пытаемся обновить токены...');
      const refreshSuccess = await forceRefreshTokens();
      if (refreshSuccess) {
        console.log('🔄 Повторяем отключение 2FA с обновленным токеном...');
        try {
          const result = await TwoFactorSecretService.disable2FA(token);
          
          // Обновляем статус 2FA в Redux store после успешного отключения
          dispatch(set2FAStatus({ isEnabled: false, secret: null }));
          console.log('✅ 2FA отключен, статус обновлен в Redux store');
          
          return result;
        } catch (retryError) {
          console.error('❌ Повторная попытка отключения 2FA не удалась:', retryError);
          return rejectWithValue(retryError);
        }
      }
    }
    return rejectWithValue(error);
  }
});

export const verify2FALogin = createAsyncThunk(
  'twoFactor/verify2FALogin',
  async ({ email, token }: { email: string; token: string }) =>
    TwoFactorSecretService.verify2FALogin(email, token),
);

export const initialize2FAStatus = createAsyncThunk(
  'twoFactor/initialize2FAStatus',
  async (user: { secret?: string }, { dispatch }) => {
    const isEnabled = !!user.secret;
    dispatch(set2FAStatus({ isEnabled, secret: user.secret || null }));
    return { isEnabled, secret: user.secret || null };
  },
);
