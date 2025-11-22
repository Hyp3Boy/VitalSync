import { create } from 'zustand';
import { DoctorQueryParams, InsuranceProvider } from '@/types/doctor';

const DEFAULT_FILTERS = {
  search: '',
  specialty: 'Todos',
  insurance: 'Todos' as DoctorQueryParams['insurance'],
  location: 'Todos',
  minRating: 4,
  page: 1,
  perPage: 9,
};

type BaseFilters = typeof DEFAULT_FILTERS;

type UpdatableFilters = Omit<BaseFilters, 'page' | 'perPage'>;

interface DoctorFiltersState extends BaseFilters {
  setFilters: (filters: Partial<UpdatableFilters>) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  resetFilters: () => void;
  selectParams: () => DoctorQueryParams;
}

export const useDoctorFiltersStore = create<DoctorFiltersState>((set, get) => ({
  ...DEFAULT_FILTERS,
  setFilters: (filters) =>
    set((state) => ({
      ...state,
      ...filters,
      page: 1,
    })),
  setPage: (page) => set({ page }),
  setPerPage: (perPage) => set({ perPage }),
  resetFilters: () => set({ ...DEFAULT_FILTERS }),
  selectParams: () => {
    const state = get();
    const params: DoctorQueryParams = {
      page: state.page,
      perPage: state.perPage,
    };

    if (state.search.trim()) params.search = state.search.trim();
    if (state.specialty !== 'Todos') params.specialty = state.specialty;
    if (state.insurance && state.insurance !== 'Todos')
      params.insurance = state.insurance as InsuranceProvider;
    if (state.location !== 'Todos') params.location = state.location;
    if (state.minRating > 0) params.minRating = state.minRating;

    return params;
  },
}));

export const doctorFilterOptions = {
  specialties: ['Todos', 'Cardiología', 'Dermatología', 'Pediatría', 'Ginecología'],
  locations: ['Todos', 'Lima, Miraflores', 'Lima, San Isidro', 'Arequipa', 'Cusco'],
  insurances: ['Todos', 'SIS', 'EsSalud', 'Privado'] as Array<
    InsuranceProvider | 'Todos'
  >,
  ratings: [4, 3],
};
