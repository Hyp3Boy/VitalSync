import { DoctorDetailResponse } from '@/types/doctor';
import { mockDoctors } from './doctors';

const detailMap: Record<string, DoctorDetailResponse> = {};

mockDoctors.forEach((doctor, index) => {
  detailMap[doctor.id] = {
    doctor: {
      ...doctor,
      bio:
        'Especialista con amplia trayectoria brindando atención cercana y personalizada a pacientes de todo el país.',
      yearsExperience: 10 + index,
      languages: ['Español', index % 2 === 0 ? 'Inglés' : 'Quechua'],
      education: 'Universidad Nacional Mayor de San Marcos',
      clinicAddress: doctor.location,
    },
    reviews: [
      {
        id: `${doctor.id}-review-1`,
        doctorId: doctor.id,
        authorName: 'María Gómez',
        rating: 5,
        comment: 'Excelente atención, explica todo con paciencia.',
        createdAt: '2025-01-15',
      },
      {
        id: `${doctor.id}-review-2`,
        doctorId: doctor.id,
        authorName: 'Luis Fernández',
        rating: 4,
        comment: 'Muy profesional, aunque la espera fue larga.',
        createdAt: '2025-02-01',
      },
    ],
  };
});

export const mockDoctorDetails = detailMap;
