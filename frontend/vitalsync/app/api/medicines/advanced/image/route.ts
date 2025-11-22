import api from '@/lib/api';
import { mockMedicines } from '@/lib/mocks/medicines';
import { MedicineListResponse } from '@/types/medicine';
import { NextRequest, NextResponse } from 'next/server';

interface ImagePayload {
  imageData?: string;
}

const simulateRecognition = (): MedicineListResponse => {
  const items = mockMedicines.slice(0, 2);
  return {
    items,
    total: items.length,
    page: 1,
    perPage: items.length,
    totalPages: 1,
  };
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ImagePayload;

  if (!body.imageData) {
    return NextResponse.json(
      { message: 'No se envió la imagen para procesar.' },
      { status: 400 }
    );
  }

  try {
    const response = await api.post<MedicineListResponse>(
      '/medicines/advanced/image',
      body
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.warn('Falling back to mock image recognition', error);
    return NextResponse.json(simulateRecognition());
  }
}
