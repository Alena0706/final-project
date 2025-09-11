import { createAsyncThunk } from '@reduxjs/toolkit';
import TwoFactorSecretService from '../api/TwoFactorService';
import { set2FAStatus } from './slice';

export const register2FA = createAsyncThunk('twoFactor/register2FA', async () =>
  TwoFactorSecretService.register2FA(),
);

export const verify2FA = createAsyncThunk('twoFactor/verify2FA', async (token: string) =>
  TwoFactorSecretService.verify2FA(token),
);

export const disable2FA = createAsyncThunk('twoFactor/disable2FA', async (token: string) =>
  TwoFactorSecretService.disable2FA(token),
);

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
