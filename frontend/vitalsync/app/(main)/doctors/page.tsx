import { DoctorExplorer } from '@/components/features/doctors/DoctorExplorer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buscar Doctor | VitalSync',
  description: 'Explora especialistas por especialidad, seguro, ciudad y calificación.',
};

export default function DoctorsPage() {
  return <DoctorExplorer />;
}
