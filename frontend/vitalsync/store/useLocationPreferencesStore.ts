import { create } from 'zustand';
import { UserLocationEntry } from '@/types/location';

interface LocationPreferencesState {
  savedLocations: UserLocationEntry[];
  selectedLocation?: UserLocationEntry;
  isLoading: boolean;
  error?: string;
  setSavedLocations: (locations: UserLocationEntry[]) => void;
  addLocation: (location: UserLocationEntry) => void;
  removeLocation: (id: string) => void;
  markAsPrimary: (id: string) => void;
  selectLocation: (location: UserLocationEntry) => void;
  setStatus: (params: { isLoading?: boolean; error?: string }) => void;
}

export const useLocationPreferencesStore = create<LocationPreferencesState>((set, get) => ({
  savedLocations: [],
  selectedLocation: undefined,
  isLoading: false,
  error: undefined,
  setSavedLocations: (locations) =>
    set((state) => ({
      savedLocations: locations,
      selectedLocation:
        state.selectedLocation ??
        locations.find((loc) => loc.isPrimary) ??
        locations[0],
    })),
  addLocation: (location) =>
    set((state) => ({
      savedLocations: [...state.savedLocations, location],
    })),
  removeLocation: (id) =>
    set((state) => {
      const next = state.savedLocations.filter((loc) => loc.id !== id);
      return {
        savedLocations: next,
        selectedLocation:
          state.selectedLocation?.id === id
            ? next.find((loc) => loc.isPrimary) ?? next[0]
            : state.selectedLocation,
      };
    }),
  markAsPrimary: (id) =>
    set((state) => ({
      savedLocations: state.savedLocations.map((loc) => ({
        ...loc,
        isPrimary: loc.id === id,
      })),
      selectedLocation:
        state.savedLocations.find((loc) => loc.id === id) ??
        state.selectedLocation,
    })),
  selectLocation: (location) => set({ selectedLocation: location }),
  setStatus: ({ isLoading, error }) =>
    set((state) => ({
      isLoading: isLoading ?? state.isLoading,
      error,
    })),
}));
