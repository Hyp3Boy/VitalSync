import { MedicineListResponse } from '@/types/medicine';
import { PrescriptionListItem } from '@/store/useAdvancedMedicineStore';

export interface AdvancedMedicineListPayload {
  medicines: PrescriptionListItem[];
}

export interface AdvancedImagePayload {
  imageData: string;
}

export const searchMedicinesByList = async (
  payload: AdvancedMedicineListPayload
): Promise<MedicineListResponse> => {
  const response = await fetch('/api/medicines/advanced', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('No se pudo procesar la búsqueda avanzada.');
  }

  return (await response.json()) as MedicineListResponse;
};

export const searchMedicinesByImage = async (
  payload: AdvancedImagePayload
): Promise<MedicineListResponse> => {
  const response = await fetch('/api/medicines/advanced/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('No se pudo analizar la imagen.');
  }

  return (await response.json()) as MedicineListResponse;
};
