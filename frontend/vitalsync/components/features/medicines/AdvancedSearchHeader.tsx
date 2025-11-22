'use client';

import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

export const AdvancedSearchHeader = () => (
  <div className="flex flex-wrap items-center justify-between">
    <div className="space-y-2">
      <h1 className="text-4xl font-black tracking-tight text-foreground">
        Búsqueda Avanzada
      </h1>
      <p className="text-base">
        Usa una imagen o crea una lista para encontrar tus medicinas
      </p>
    </div>
    <Link
      href="/medicines"
      className="flex items-center gap-2 text-sm font-semibold text-primary"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      Ir a Búsqueda Normal
    </Link>
  </div>
);
