import api from '@/lib/api';
import { mockDoctorDetails } from '@/lib/mocks/doctorDetails';
import { mockDoctors } from '@/lib/mocks/doctors';
import { DoctorDetailResponse } from '@/types/doctor';
import { NextRequest, NextResponse } from 'next/server';

const buildMockResponse = (id: string): DoctorDetailResponse | undefined => {
  if (mockDoctorDetails[id]) return mockDoctorDetails[id];
  const doctor = mockDoctors.find((doc) => doc.id === id);
  console.log('Mock doctor not found, building basic mock for id:', id);
  if (!doctor) return undefined;
  return {
    doctor: {
      ...doctor,
      bio:
        'Profesional con amplia experiencia ofreciendo acompañamiento integral.',
      yearsExperience: 12,
      languages: ['Español'],
      education: 'Universidad Peruana Cayetano Heredia',
      clinicAddress: doctor.location,
    },
    reviews: [],
  };
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const response = await api.get<DoctorDetailResponse>(`/doctors/${id}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.warn('Falling back to mock doctor detail', error);
    const data = buildMockResponse(id);
    if (!data) {
      return NextResponse.json({ message: 'Doctor no encontrado' }, { status: 404 });
    }
    return NextResponse.json(data);
  }
}
