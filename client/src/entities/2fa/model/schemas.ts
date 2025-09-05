import { userSchema } from '@/entities/auth/model/schemas';
import z from 'zod';
import '@ant-design/v5-patch-for-react-19';

export const userRegister2faSchema = z.object({
  ascii: z.string(),
  hex: z.string(),
  base32: z.string(),
  otpauth_url: z.string(),
});

export const userVerify2faSchema = z.object({
  isValid: z.boolean(),
});

export const user2faSchema = z.object({
  user: userSchema,
  isValid: z.boolean(),
});
