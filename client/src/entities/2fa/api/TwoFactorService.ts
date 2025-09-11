// services/TwoFactorSecretService.ts
import axiosInstance from '@/shared/api/axiosInstance';
import type {
  userRegister2faSchemaT,
  verify2FASchemaT,
  disable2FASchemaT,
  verify2FALoginSchemaT,
} from '../model/schemas';
import {
  userRegister2faSchema,
  verify2FASchema,
  disable2FASchema,
  verify2FALoginSchema,
} from '../model/schemas';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class TwoFactorSecretService {
  static async register2FA(): Promise<userRegister2faSchemaT> {
    const response = await axiosInstance.post('/auth/2fa/generate');
    console.log(response.data);
    return userRegister2faSchema.parse(response.data);
  }

  static async verify2FA(token: string): Promise<verify2FASchemaT> {
    const response = await axiosInstance.post('/auth/2fa/verify', { token });
    return verify2FASchema.parse(response.data);
  }

  static async disable2FA(token: string): Promise<disable2FASchemaT> {
    const response = await axiosInstance.post('/auth/2fa/disable', { token });
    return disable2FASchema.parse(response.data);
  }

  static async verify2FALogin(email: string, token: string): Promise<verify2FALoginSchemaT> {
    const response = await axiosInstance.post('/auth/2fa/verify-login', { email, token });
    return verify2FALoginSchema.parse(response.data);
  }
}

export default TwoFactorSecretService;
