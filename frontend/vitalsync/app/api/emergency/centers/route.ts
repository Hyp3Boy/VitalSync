import { mockEmergencyCenters } from '@/lib/mocks/emergencyCenters';
import { EmergencyCenter } from '@/types/emergency';
import { NextResponse } from 'next/server';

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 450));
  return NextResponse.json<{ items: EmergencyCenter[] }>({
    items: mockEmergencyCenters,
  });
}
