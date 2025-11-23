import { UserLocationEntry, UserLocationResponse } from '@/types/location';
import { userLocationEntrySchema, userLocationResponseSchema } from '@/lib/validations/apiSchemas';
import { notifyError } from '@/lib/utils/toast';

export const fetchUserLocations = async (): Promise<UserLocationEntry[]> => {
  const response = await fetch('/api/locations');
  if (!response.ok) {
    throw new Error('No se pudieron cargar tus ubicaciones.');
  }
  const data = (await response.json()) as UserLocationResponse;
  const parsed = userLocationResponseSchema.safeParse(data);
  if (!parsed.success) {
    notifyError(new Error('Respuesta inválida de ubicaciones'), 'Respuesta inválida de ubicaciones');
    return data.items;
  }
  return parsed.data.items;
};

export interface CreateLocationPayload {
  label: string;
  addressLine: string;
  tag: 'home' | 'office' | 'other';
}

// BACKEND CONTRACTS:
// GET /api/locations -> returns UserLocationResponse { items: UserLocationEntry[] }
// POST /api/locations -> accepts CreateLocationPayload and returns UserLocationEntry
// DELETE /api/locations/:id -> returns 204
// PATCH /api/locations/:id { isPrimary: true } -> returns 200

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
  const data = (await response.json()) as unknown;
  const parsed = userLocationEntrySchema.safeParse(data);
  if (!parsed.success) {
    notifyError(new Error('Respuesta inválida al crear ubicación'), 'Respuesta inválida al crear ubicación');
  }
  return parsed.success ? parsed.data : (data as UserLocationEntry);
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
