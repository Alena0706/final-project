import type z from 'zod';
import type {
  userRegister2faSchema,
  verify2FASchema,
  disable2FASchema,
  verify2FALoginSchema,
} from './schemas';

export type userRegister2faSchemaT = z.infer<typeof userRegister2faSchema>;
export type verify2FASchemaT = z.infer<typeof verify2FASchema>;
export type disable2FASchemaT = z.infer<typeof disable2FASchema>;
export type verify2FALoginSchemaT = z.infer<typeof verify2FALoginSchema>;
