import api from '@/lib/api';
import { mockUserLocations } from '@/lib/mocks/locations';
import { UserLocationEntry, UserLocationResponse } from '@/types/location';
import { NextRequest, NextResponse } from 'next/server';

const buildResponse = (): UserLocationResponse => ({
  items: mockUserLocations,
});

export async function GET() {
  try {
    const response = await api.get<UserLocationResponse>('/locations');
    return NextResponse.json(response.data);
  } catch (error) {
    console.warn('Falling back to mock locations', error);
    return NextResponse.json(buildResponse());
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<UserLocationEntry>;
  try {
    const response = await api.post<UserLocationEntry>('/locations', body);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.warn('Mocking location creation', error);
    const newLocation: UserLocationEntry = {
      id: crypto.randomUUID(),
      label: body.label ?? 'Nueva ubicación',
      addressLine: body.addressLine ?? 'Dirección pendiente',
      latitude: 0,
      longitude: 0,
      tag: body.tag ?? 'other',
      isPrimary: false,
    };
    mockUserLocations.push(newLocation);
    return NextResponse.json(newLocation, { status: 201 });
  }
}
