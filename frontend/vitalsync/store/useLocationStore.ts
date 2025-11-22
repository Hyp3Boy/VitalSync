// src/store/useLocationStore.ts
import { create } from 'zustand';

// Este será el tipo de dato para nuestra ubicación final
export interface LocationData {
  address: string;
  city: string;
  postalCode: string;
}

interface LocationState {
  location: LocationData | null;
  isLocationModalOpen: boolean;
  isLoading: boolean; // Para mostrar un spinner mientras se detecta
  error: string | null;
  setLocation: (location: LocationData) => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  detectAndSetLocation: () => void; // Nueva acción para la detección
}

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  isLocationModalOpen: false,
  isLoading: false,
  error: null,
  setLocation: (location) => set({ location, isLocationModalOpen: false }),
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
          };
          set({
            location: mockLocation,
            isLoading: false,
            isLocationModalOpen: false,
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
