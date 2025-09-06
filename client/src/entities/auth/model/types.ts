import type z from 'zod';
import type {
  AuthResponseSchema,
  userLoginSchema,
  userRegisterSchema,
  userSchema,
  userUpdateResponseSchema,
  userUpdateSchema,
} from './schemas';
import type { userRegister2faSchemaT } from '@/entities/2fa/model/types';

export type UserT = z.infer<typeof userSchema>;
export type UserRegisterT = z.infer<typeof userRegisterSchema>;
export type UserLoginT = z.infer<typeof userLoginSchema>;
export type AuthResponseT = z.infer<typeof AuthResponseSchema>;
export type UserUpdateT = z.infer<typeof userUpdateSchema>;
export type UserUpdateResponseT = z.infer<typeof userUpdateResponseSchema>;

export type UserStateT = {
  user: AuthResponseT | null;
  status: 'guest' | 'logged' | 'loading';
  error: string | null;
  secret: userRegister2faSchemaT | null;
};
