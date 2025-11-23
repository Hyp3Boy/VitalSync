import { EmergencyPage } from '@/components/features/emergency/EmergencyPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servicios de Emergencia | VitalSync',
  description:
    'Accede rápidamente a números de emergencia y localiza el hospital más cercano con el mapa interactivo.',
};

export default function EmergencyServicesPage() {
  return <EmergencyPage />;
}
