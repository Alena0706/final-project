// model/schemas.ts
import { z } from 'zod';

export const userRegister2faSchema = z.object({
  secret: z.string(),
  otpauth_url: z.string(),
});

export const verify2FASchema = z.object({
  verified: z.boolean(),
  message: z.string(),
});

export const disable2FASchema = z.object({
  message: z.string(),
});

export const verify2FALoginSchema = z.object({
  user: z.object({
    id: z.union([z.number(), z.string()]).transform((val) => Number(val)),
    name: z.string(),
    email: z.string(),
    phone: z.string().nullable(),
    city: z.string().nullable(),
    avatar: z.string().nullable(),
    admin: z.boolean(),
    balance: z
      .union([z.number(), z.string()])
      .transform((val) => (val ? Number(val) : null))
      .nullable(),
    role: z.string(),
    emailVerified: z.boolean(),
  }),
  accessToken: z.string(),
});

export type userRegister2faSchemaT = z.infer<typeof userRegister2faSchema>;
export type verify2FASchemaT = z.infer<typeof verify2FASchema>;
export type disable2FASchemaT = z.infer<typeof disable2FASchema>;
export type verify2FALoginSchemaT = z.infer<typeof verify2FALoginSchema>;
