import { MedicineExplorer } from '@/components/features/medicines/MedicineExplorer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buscar Medicinas | VitalSync',
  description:
    'Encuentra medicinas cercanas, compara precios y disponibilidad en tiempo real.',
};

export default function MedicinesPage() {
  return <MedicineExplorer />;
}
