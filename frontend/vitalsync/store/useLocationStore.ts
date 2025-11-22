import { STORAGE_KEYS } from '@/lib/constants/storage';
import { create } from 'zustand';

export interface LocationData {
  address: string;
  city: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

interface LocationState {
  location: LocationData | null;
  isLocationModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  setLocation: (location: LocationData) => void;
  clearLocation: () => void;
  hydrateLocation: () => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  detectAndSetLocation: () => void;
}

const persistLocation = (location: LocationData | null) => {
  if (typeof window === 'undefined') return;
  if (!location) {
    window.localStorage.removeItem(STORAGE_KEYS.activeLocation);
    return;
  }
  window.localStorage.setItem(
    STORAGE_KEYS.activeLocation,
    JSON.stringify(location)
  );
};

const readStoredLocation = (): LocationData | null => {
  if (typeof window === 'undefined') return null;
  const rawValue = window.localStorage.getItem(STORAGE_KEYS.activeLocation);
  if (!rawValue) return null;
  try {
    return JSON.parse(rawValue) as LocationData;
  } catch (error) {
    console.warn('No se pudo interpretar la ubicación almacenada', error);
    window.localStorage.removeItem(STORAGE_KEYS.activeLocation);
    return null;
  }
};

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  isLocationModalOpen: false,
  isLoading: false,
  error: null,
  setLocation: (location) =>
    set(() => {
      persistLocation(location);
      return { location, isLocationModalOpen: false };
    }),
  clearLocation: () =>
    set(() => {
      persistLocation(null);
      return { location: null };
    }),
  hydrateLocation: () =>
    set((state) => {
      if (state.location) return state;
      const stored = readStoredLocation();
      if (!stored) return state;
      return { ...state, location: stored };
    }),
  openLocationModal: () => set({ isLocationModalOpen: true, error: null }),
  closeLocationModal: () => set({ isLocationModalOpen: false }),
  detectAndSetLocation: () => {
    set({ isLoading: true, error: null });

    if (!navigator.geolocation) {
      set({
        error: 'La geolocalización no es soportada por tu navegador.',
        isLoading: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // --- SIMULACIÓN DE GEOCODIFICACIÓN INVERSA ---
        // En una app real, aquí llamarías a una API (Google Maps, Mapbox)
        // para convertir las coordenadas (lat, lng) en una dirección.
        console.log('Coordenadas obtenidas:', position.coords);

        setTimeout(() => {
          // Simulamos el retraso de la API
          const mockLocation: LocationData = {
            address: 'Av. Javier Prado Este 4600',
            city: 'Lima',
            postalCode: '15023',
            latitude: -12.071655,
            longitude: -77.033667,
          };
          set(() => {
            persistLocation(mockLocation);
            return {
              location: mockLocation,
              isLoading: false,
              isLocationModalOpen: false,
            };
          });
        }, 1500);
      },
      () => {
        set({
          error:
            'No se pudo obtener tu ubicación. Por favor, ingrésala manualmente.',
          isLoading: false,
        });
      }
    );
  },
}));
