import z from 'zod';

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  phone: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  secret: z.string().nullable(),
  admin: z.boolean(),
  avatar: z.string().nullable(),
  balance: z.string(), // Сервер возвращает balance как строку
  transactions: z
    .array(z.object({ id: z.string(), amount: z.number().min(1), date: z.string() }))
    .nullable(),
  role: z.string().optional(),
  registrationDate: z.string().nullable().optional(),
  monthlyAmount: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  emailVerified: z.boolean().optional().default(false),
  emailVerificationToken: z.string().nullable().optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2, { message: 'Имя должно быть не короче 2 символов' }).optional(),
  email: z.email({ message: 'Некорректный email' }).optional(),
  password: z.string()
    .min(8, { message: 'Пароль должен быть не короче 8 символов' })
    .regex(/[A-Z]/, { message: 'Пароль должен содержать хотя бы одну заглавную букву' })
    .regex(/[a-z]/, { message: 'Пароль должен содержать хотя бы одну строчную букву' })
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { message: 'Пароль должен содержать хотя бы один специальный символ' })
    .optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  balance: z.string().optional(), // Изменено на string для соответствия серверу
  transactions: z
    .array(z.object({ id: z.string(), amount: z.number().min(1), date: z.string() }))
    .nullable()
    .optional(),
  oldpassword: z.string().optional(),
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
  password: z.string()
    .min(8, { message: 'Пароль должен быть не короче 8 символов' })
    .regex(/[A-Z]/, { message: 'Пароль должен содержать хотя бы одну заглавную букву' })
    .regex(/[a-z]/, { message: 'Пароль должен содержать хотя бы одну строчную букву' })
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { message: 'Пароль должен содержать хотя бы один специальный символ' }),
  phone: z.string().optional(),
  city: z.string().optional(),
});

export const userLoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const AuthResponseSchema = z.object({
  user: userSchema,
  accessToken: z.string(),
});

export const emailVerificationSchema = z.object({
  token: z.string(),
});

export const resendVerificationSchema = z.object({
  email: z.string().email(),
});
