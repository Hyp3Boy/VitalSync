// src/services/centerService.ts
import { notifyError } from '@/lib/utils/toast';
import { getLocationPayload } from '@/lib/utils/location';
import { EmergencyCenter } from '@/types/emergency';

export interface CenterSearchResponse {
  data: EmergencyCenter[];
  // Aquí podríamos añadir metadata de paginación en el futuro
}

interface CenterSearchParams {
  query?: string;
  range: number; // en km
}

export const searchCenters = async ({
  query,
  range,
}: CenterSearchParams): Promise<EmergencyCenter[]> => {
  try {
    const location = getLocationPayload();

    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      range: range.toString(),
    });

    if (query) {
      params.append('query', query);
    }

    const response = await fetch(`/api/centers/search?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result: CenterSearchResponse = await response.json();
    return result.data ?? [];
  } catch (error) {
    notifyError({
      userMessage: 'No se pudieron buscar los centros de salud.',
      error,
    });
    return []; // Devolver un array vacío en caso de error
  }
};