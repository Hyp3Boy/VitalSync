'use client';

import { useMutation } from '@tanstack/react-query';
import {
  AdvancedImagePayload,
  AdvancedMedicineListPayload,
  searchMedicinesByImage,
  searchMedicinesByList,
} from '@/services/medicineAdvancedService';
import { useAdvancedMedicineStore } from '@/store/useAdvancedMedicineStore';
import { toast } from 'sonner';

const successMessage = (count: number) =>
  count > 0
    ? `Encontramos ${count} medicina${count === 1 ? '' : 's'}.`
    : 'No se encontraron coincidencias. Ajusta tu búsqueda.';

export const useAdvancedListSearch = () => {
  const setResults = useAdvancedMedicineStore((state) => state.setResults);

  return useMutation({
    mutationFn: (payload: AdvancedMedicineListPayload) =>
      searchMedicinesByList(payload),
    onSuccess: (data) => {
      setResults(data);
      toast.success(successMessage(data.total));
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No pudimos procesar tu lista. Intenta de nuevo.'
      );
    },
  });
};

export const useAdvancedImageSearch = () => {
  const setResults = useAdvancedMedicineStore((state) => state.setResults);

  return useMutation({
    mutationFn: (payload: AdvancedImagePayload) =>
      searchMedicinesByImage(payload),
    onSuccess: (data) => {
      setResults(data);
      toast.success(successMessage(data.total));
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No pudimos analizar la imagen. Intenta nuevamente.'
      );
    },
  });
};
