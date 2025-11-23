'use client';

import { TextSearchIcon } from 'lucide-react';
import Link from 'next/link';

export const MedicineSearchHero = () => {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          Búsqueda de Medicinas
        </h1>
        <p className="text-base">Encuentra medicinas y compara precios</p>
      </div>
      <Link
        href="/medicines/advanced"
        className="flex items-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
      >
        <TextSearchIcon className="h-4 w-4" />
        Ir a Búsqueda Avanzada
      </Link>
    </div>
  );
};
