import { z } from 'zod';

export const medicineSearchSchema = z.object({
  query: z
    .string()
    .min(1, 'Ingresa el nombre de la medicina o principio activo.'),
});

export type MedicineSearchSchema = z.infer<typeof medicineSearchSchema>;

export const advancedMedicineSchema = z.object({
  listItems: z
    .array(z.string().min(2, 'Ingresa al menos 2 caracteres'))
    .min(1, 'Agrega al menos una medicina para buscar.'),
});

export type AdvancedMedicineSchema = z.infer<typeof advancedMedicineSchema>;
