import { createAsyncThunk } from '@reduxjs/toolkit';
import TwoFactorService from '../api/2faService';

type register2FAT = {
  userId: number | undefined;
  userEmail: string | undefined;
};

export const register2FA = createAsyncThunk(
  'user/register2FA',
  async ({ userId, userEmail }: register2FAT) => TwoFactorService.register2FA(userId, userEmail),
);

