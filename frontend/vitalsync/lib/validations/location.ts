import z from 'zod';

export const locationSchema = z.object({
  address: z
    .string()
    .min(5, { message: 'La dirección debe tener al menos 5 caracteres.' }),
  city: z.string().min(2, { message: 'La ciudad es requerida.' }),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, { message: 'Debe ser un código postal de 5 dígitos.' }),
});
