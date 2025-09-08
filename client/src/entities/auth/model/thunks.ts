import { createAsyncThunk } from '@reduxjs/toolkit';
import type { UserLoginT, UserRegisterT, UserUpdateT } from './types';
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

export const uploadAvatar = createAsyncThunk('user/uploadAvatar', async (formData: FormData) =>
  UserServices.uploadAvatar(formData),
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

export const verify2FA = createAsyncThunk('user/verify2FA', async ({ token, email }: verify2FAT) => {
  const response = await UserServices.verify2FA(token, email);
  setAccessToken(response.accessToken);
  return response;
});
