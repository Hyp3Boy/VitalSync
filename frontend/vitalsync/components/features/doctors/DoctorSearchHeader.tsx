'use client';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { useDoctorFiltersStore } from '@/store/useDoctorFiltersStore';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DoctorSearchHeaderProps {
  totalResults?: number;
}

export const DoctorSearchHeader = ({
  totalResults = 0,
}: DoctorSearchHeaderProps) => {
  const search = useDoctorFiltersStore((state) => state.search);
  const setFilters = useDoctorFiltersStore((state) => state.setFilters);
  const [localQuery, setLocalQuery] = useState(search);
  const debounced = useDebounce(localQuery, 300);

  useEffect(() => {
    setLocalQuery(search);
  }, [search]);

  useEffect(() => {
    setFilters({ search: debounced });
  }, [debounced, setFilters]);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          Buscar Doctor
        </h1>
        <p className="text-base text-muted-foreground">
          {totalResults > 0
            ? `Mostrando ${totalResults} resultados`
            : 'Explora especialistas por nombre o especialidad'}
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={localQuery}
          onChange={(event) => setLocalQuery(event.target.value)}
          placeholder="Buscar por nombre, especialidad..."
          className="h-14 rounded-2xl border-2 border-border bg-card pl-12 text-base shadow-inner"
        />
      </div>
    </div>
  );
};
