import { EmergencyCenter } from '@/types/emergency';

export interface EmergencyCentersResponse {
  items: EmergencyCenter[];
}

export const fetchEmergencyCenters = async (): Promise<EmergencyCenter[]> => {
  const response = await fetch('/api/emergency/centers');
  if (!response.ok) {
    throw new Error('No se pudo cargar la red de emergencias.');
  }
  const data = (await response.json()) as EmergencyCentersResponse;
  return data.items;
};
