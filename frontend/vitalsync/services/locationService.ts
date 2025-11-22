import { UserLocationEntry, UserLocationResponse } from '@/types/location';

export const fetchUserLocations = async (): Promise<UserLocationEntry[]> => {
  const response = await fetch('/api/locations');
  if (!response.ok) {
    throw new Error('No se pudieron cargar tus ubicaciones.');
  }
  const data = (await response.json()) as UserLocationResponse;
  return data.items;
};

export interface CreateLocationPayload {
  label: string;
  addressLine: string;
  tag: 'home' | 'office' | 'other';
}

export const createLocation = async (
  payload: CreateLocationPayload
): Promise<UserLocationEntry> => {
  const response = await fetch('/api/locations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('No se pudo guardar la dirección.');
  }
  return (await response.json()) as UserLocationEntry;
};

export const deleteLocation = async (locationId: string) => {
  const response = await fetch(`/api/locations/${locationId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('No se pudo eliminar la dirección.');
  }
};

export const markPrimaryLocation = async (locationId: string) => {
  const response = await fetch(`/api/locations/${locationId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isPrimary: true }),
  });
  if (!response.ok) {
    throw new Error('No se pudo actualizar la dirección.');
  }
};
