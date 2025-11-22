import api from '@/lib/api';
import { mockUserLocations } from '@/lib/mocks/locations';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = (await request.json()) as { isPrimary?: boolean };

  try {
    const response = await api.patch(`/locations/${id}`, body);
    return NextResponse.json(response.data);
  } catch (error) {
    console.warn('Mocking location update', error);
    if (body.isPrimary) {
      mockUserLocations.forEach((location) => {
        location.isPrimary = location.id === id;
      });
    }
    const updated = mockUserLocations.find((loc) => loc.id === id);
    if (!updated) {
      return NextResponse.json({ message: 'Ubicación no encontrada' }, { status: 404 });
    }
    return NextResponse.json(updated);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await api.delete(`/locations/${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.warn('Mocking location delete', error);
    const index = mockUserLocations.findIndex((loc) => loc.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Ubicación no encontrada' }, { status: 404 });
    }
    mockUserLocations.splice(index, 1);
    return NextResponse.json({ success: true });
  }
}
