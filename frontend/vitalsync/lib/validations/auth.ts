import { z } from 'zod';

export const registerSchema = z.object({
  dni: z.string().min(8, 'El DNI debe tener al menos 8 caracteres'),
  fullName: z.string().min(3, 'El nombre completo es requerido'),
  phone: z.string().min(9, 'El número de teléfono no es válido'),
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Por favor, ingresa tu email o DNI'),
  password: z.string().min(1, 'Por favor, ingresa tu contraseña'),
});

export type TRegisterSchema = z.infer<typeof registerSchema>;
export type TLoginSchema = z.infer<typeof loginSchema>;
