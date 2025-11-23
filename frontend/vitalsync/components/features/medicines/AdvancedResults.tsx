'use client';

import { useAdvancedMedicineStore } from '@/store/useAdvancedMedicineStore';
import { MedicineResultCard } from '@/components/features/medicines/MedicineResultCard';

export const AdvancedResults = () => {
  const results = useAdvancedMedicineStore((state) => state.results);

  if (!results) return null;

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <h3 className="text-xl font-semibold">
        Resultados ({results.total})
      </h3>
      <div className="flex flex-col gap-4">
        {results.items.map((item) => (
          <MedicineResultCard key={item.id} medicine={item} />
        ))}
      </div>
    </div>
  );
};
