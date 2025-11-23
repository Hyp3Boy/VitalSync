// src/lib/utils/location.ts
import { useLocationStore } from '@/store/useLocationStore';

/**
 * Obtiene la ubicación actual del store de Zustand de forma síncrona.
 * Lanza un error si la ubicación no está disponible.
 * @returns Un objeto con latitud y longitud.
 */
export const getLocationPayload = () => {
  const { location } = useLocationStore.getState();

  if (!location?.latitude || !location?.longitude) {
    // Este error será capturado por el servicio que lo llame
    throw new Error('La ubicación del usuario no está disponible.');
  }

  return {
    latitude: location.latitude,
    longitude: location.longitude,
  };
};