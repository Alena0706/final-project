import { createAsyncThunk } from '@reduxjs/toolkit';
import type { UserLoginT, UserRegisterT, UserUpdateT } from './types';
import UserServices from '../api/userServices';

type verify2FAT = {
  token: string;
  email: string
};

export const updateUser = createAsyncThunk('user/updateUser', async (user: UserUpdateT) => {

  const update = await UserServices.updateUser(user);
  console.log(update);
  return update;
}
);

export const registerUser = createAsyncThunk('user/register', (user: UserRegisterT) =>
  UserServices.register(user),
);

export const uploadAvatar = createAsyncThunk('user/uploadAvatar', async (formData: FormData) =>
  UserServices.uploadAvatar(formData),
);

export const loginUser = createAsyncThunk('user/login', (user: UserLoginT) =>
  UserServices.login(user),
);

export const refreshUser = createAsyncThunk('user/refresh', async () => UserServices.refresh());

export const logoutUser = createAsyncThunk('user/logout', async () => UserServices.logout());

export const verify2FA = createAsyncThunk('user/verify2FA', async ({ token, email }: verify2FAT) =>
  UserServices.verify2FA(token, email),
);

