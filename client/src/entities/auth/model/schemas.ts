import z from 'zod';

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  phone: z.string().optional(),
  city: z.string().optional(),
  secret: z.string().nullable(),
});

export const userRegisterSchema = z.object({
  email: z.string(),
  name: z.string(),
  password: z.string(),
  phone: z.string().optional(),
  city: z.string().optional(),
});

export const userLoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  user: userSchema,
});
