import api from '@/lib/api';
import { mockMedicines } from '@/lib/mocks/medicines';
import { MedicineListResponse } from '@/types/medicine';
import { NextRequest, NextResponse } from 'next/server';

interface AdvancedPayload {
  medicines?: Array<{ name: string; quantity: number }>;
}

const matchMedicines = (payload: AdvancedPayload): MedicineListResponse => {
  const { medicines = [] } = payload;
  if (!medicines.length) {
    return {
      items: [],
      total: 0,
      page: 1,
      perPage: 10,
      totalPages: 1,
    };
  }

  const normalized = medicines
    .map((item) => item.name.toLowerCase())
    .filter(Boolean);
  const items = mockMedicines.filter((item) =>
    normalized.some((target) => item.name.toLowerCase().includes(target))
  );

  return {
    items,
    total: items.length,
    page: 1,
    perPage: items.length || 1,
    totalPages: 1,
  };
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as AdvancedPayload;

  try {
    const response = await api.post<MedicineListResponse>(
      '/medicines/advanced',
      body
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.warn('Falling back to mock advanced medicine search', error);
    return NextResponse.json(matchMedicines(body));
  }
}
