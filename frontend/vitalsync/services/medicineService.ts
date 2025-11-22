import { MedicineListResponse, MedicineQueryParams } from '@/types/medicine';

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

  return (await response.json()) as MedicineListResponse;
};
