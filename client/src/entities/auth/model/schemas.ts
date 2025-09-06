import z from 'zod';

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  phone: z.string().optional(),
  city: z.string().optional(),
  secret: z.string().nullable(),
  admin: z.boolean(),
  avatar: z.string().nullable(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2, { message: 'Имя должно быть не короче 2 символов' }).optional(),
  email: z.email({ message: 'Некорректный email' }).optional(),
  password: z.string().min(6, { message: 'Пароль должен быть не короче 6 символов' }).optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
});

export const userUpdateResponseSchema = z.object({
  admin: z.boolean(),
  avatar: z.string().nullable(), // может быть строкой или null
  city: z.string().min(1),
  createdAt: z.string().optional(),
  email: z.email(),
  id: z.number().int(),
  name: z.string().min(1),
  phone: z.string().min(1),
  secret: z.string().nullable(),
  updatedAt: z.string().optional(),
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
