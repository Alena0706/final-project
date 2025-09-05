import type z from 'zod';
import type { user2faSchema, userRegister2faSchema, userVerify2faSchema } from './schemas';
import type { AuthResponseT } from '@/entities/user/model/types';

export type userRegister2faSchemaT = z.infer<typeof userRegister2faSchema>;
export type userVerify2faSchemaT = z.infer<typeof userVerify2faSchema>;
export type user2faSchemaT = z.infer<typeof user2faSchema>;

export type TwoFactorStateT = {
  user: AuthResponseT | null;
  status: 'guest' | 'logged' | 'loading';
  error: string | null;
  secret: userRegister2faSchemaT | null;
};
