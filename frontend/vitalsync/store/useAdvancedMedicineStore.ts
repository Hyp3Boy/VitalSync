import { MedicineListResponse } from '@/types/medicine';
import { create } from 'zustand';

export interface PrescriptionListItem {
  name: string;
  quantity: number;
}

interface AdvancedMedicineState {
  medicines: PrescriptionListItem[];
  previewImage?: string;
  results: MedicineListResponse | null;
  setMedicines: (items: PrescriptionListItem[]) => void;
  setPreviewImage: (url?: string) => void;
  setResults: (data: MedicineListResponse | null) => void;
  reset: () => void;
}

export const useAdvancedMedicineStore = create<AdvancedMedicineState>((set) => ({
  medicines: [],
  previewImage: undefined,
  results: null,
  setMedicines: (items) => set({ medicines: items }),
  setPreviewImage: (url) => set({ previewImage: url }),
  setResults: (data) => set({ results: data }),
  reset: () => set({ medicines: [], previewImage: undefined, results: null }),
}));
