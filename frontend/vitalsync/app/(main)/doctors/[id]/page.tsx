import { DoctorDetailView } from '@/components/features/doctors/DoctorDetailView';
import type { Metadata } from 'next';

interface DoctorPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Detalle del Profesional | VitalSync',
};

export default async function DoctorDetailPage({ params }: DoctorPageProps) {
  const { id } = await params;
  return <DoctorDetailView doctorId={id} />;
}
