import { create } from 'zustand';
import {
  MedicineAvailability,
  MedicineQueryParams,
  MedicineSortOption,
} from '@/types/medicine';

interface MedicineFiltersState {
  search: string;
  sort: MedicineSortOption;
  availability: MedicineAvailability;
  page: number;
  perPage: number;
  setSearch: (value: string) => void;
  setSort: (value: MedicineSortOption) => void;
  setAvailability: (value: MedicineAvailability) => void;
  setPage: (page: number) => void;
  selectParams: () => MedicineQueryParams;
}

export const useMedicineFiltersStore = create<MedicineFiltersState>((set, get) => ({
  search: '',
  sort: 'price',
  availability: 'all',
  page: 1,
  perPage: 10,
  setSearch: (value) => set({ search: value, page: 1 }),
  setSort: (value) => set({ sort: value, page: 1 }),
  setAvailability: (value) => set({ availability: value, page: 1 }),
  setPage: (page) => set({ page }),
  selectParams: () => {
    const state = get();
    const params: MedicineQueryParams = {
      page: state.page,
      perPage: state.perPage,
      sort: state.sort,
    };

    if (state.search.trim()) params.search = state.search.trim();
    if (state.availability !== 'all') params.availability = state.availability;

    return params;
  },
}));
