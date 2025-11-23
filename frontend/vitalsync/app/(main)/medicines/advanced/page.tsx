import { AdvancedSearchHeader } from '@/components/features/medicines/AdvancedSearchHeader';
import { ImageSearchCard } from '@/components/features/medicines/ImageSearchCard';
import { ListBuilderCard } from '@/components/features/medicines/ListBuilderCard';
import { AdvancedResults } from '@/components/features/medicines/AdvancedResults';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Búsqueda Avanzada de Medicinas | VitalSync',
  description: 'Escanea recetas o crea listas para encontrar medicamentos rápidamente.',
};

export default function AdvancedMedicinesPage() {
  return (
    <div className="flex flex-col gap-8">
      <AdvancedSearchHeader />
      <div className="grid gap-6 lg:grid-cols-2">
        <ImageSearchCard />
        <ListBuilderCard />
      </div>
      <AdvancedResults />
    </div>
  );
}
