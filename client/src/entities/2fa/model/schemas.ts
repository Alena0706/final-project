import { userSchema } from '@/entities/auth/model/schemas';
import z from 'zod';

export const userRegister2faSchema = z.object({
  secret: z.string(),
  qrCodeUrl: z.string(),
});

export const userVerify2faSchema = z.object({
  verified: z.boolean(),
  message: z.string(),
});

export const user2faSchema = z.object({
  user: userSchema,
  verified: z.boolean(),
});
