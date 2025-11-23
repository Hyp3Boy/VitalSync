'use client';

import { MedicineSearchHero } from '@/components/features/medicines/MedicineSearchHero';
import { MedicineSearchBar } from '@/components/features/medicines/MedicineSearchBar';
import { MedicineFilterBar } from '@/components/features/medicines/MedicineFilterBar';
import { MedicineResults } from '@/components/features/medicines/MedicineResults';
import { useMedicinesQuery } from '@/hooks/useMedicinesQuery';

export const MedicineExplorer = () => {
  const query = useMedicinesQuery();

  return (
    <div className="flex flex-col gap-8">
      <MedicineSearchHero />
      <MedicineSearchBar />
      <MedicineFilterBar />
      <MedicineResults query={query} />
    </div>
  );
};
