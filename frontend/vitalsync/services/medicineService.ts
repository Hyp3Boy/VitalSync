import { MedicineListResponse, MedicineQueryParams } from '@/types/medicine';
import { medicineListResponseSchema } from '@/lib/validations/apiSchemas';
import { notifyError } from '@/lib/utils/toast';

const buildQueryString = (params: MedicineQueryParams) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    sp.set(key, String(value));
  });
  return sp.toString();
};

export const fetchMedicines = async (
  params: MedicineQueryParams
): Promise<MedicineListResponse> => {
  const qs = buildQueryString(params);
  const response = await fetch(qs ? `/api/medicines?${qs}` : '/api/medicines');

  if (!response.ok) {
    throw new Error('No se pudieron obtener las medicinas.');
  }

  const data = (await response.json()) as unknown;
  const parsed = medicineListResponseSchema.safeParse(data);
  if (!parsed.success) {
    notifyError(new Error('Respuesta inválida de listado de medicinas'), 'Respuesta inválida de listado de medicinas');
  }
  return parsed.success ? parsed.data : (data as MedicineListResponse);
};

// BACKEND CONTRACT:
// GET /medicines?search&sort&availability&page&perPage
// -> returns MedicineListResponse { items, total, page, perPage, totalPages }
