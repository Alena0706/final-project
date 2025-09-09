import { createAsyncThunk } from '@reduxjs/toolkit';
import type { EmailVerificationT, ResendVerificationT, UserLoginT, UserRegisterT, UserUpdateT } from './types';
import UserServices from '../api/userServices';
import { setAccessToken, removeAccessToken } from '@/shared/api/axiosInstance';

type verify2FAT = {
  token: string;
  email: string;
};

export const updateUser = createAsyncThunk('user/updateUser', async (user: UserUpdateT) => {
  const update = await UserServices.updateUser(user);
  return update;
});

export const registerUser = createAsyncThunk('user/register', async (user: UserRegisterT) => {
  const response = await UserServices.register(user);
  setAccessToken(response.accessToken);
  return response;
});

export const uploadAvatar = createAsyncThunk<{ user: { avatar: string } }, FormData>(
  'user/uploadAvatar',
  async (formData: FormData) => {
    const result = await UserServices.uploadAvatar(formData);
    return result as { user: { avatar: string } };
  },
);

export const loginUser = createAsyncThunk('user/login', async (user: UserLoginT) => {
  const response = await UserServices.login(user);
  setAccessToken(response.accessToken);
  return response;
});

export const refreshUser = createAsyncThunk('user/refresh', async () => {
  const response = await UserServices.refresh();
  setAccessToken(response.accessToken);
  return response;
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await UserServices.logout();
  removeAccessToken();
});

export const verify2FA = createAsyncThunk(
  'user/verify2FA',
  async ({ token, email }: verify2FAT) => {
    const response = await UserServices.verify2FA(token, email);
    setAccessToken(response.accessToken);
    return response;
  },
);

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
