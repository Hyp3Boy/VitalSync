'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMedicineFiltersStore } from '@/store/useMedicineFiltersStore';
import { MedicineAvailability, MedicineSortOption } from '@/types/medicine';

const sortOptions: Array<{ label: string; value: MedicineSortOption }> = [
  { label: 'Precio más bajo', value: 'price' },
  { label: 'Distancia más cercana', value: 'distance' },
  { label: 'Mejor disponibilidad', value: 'availability' },
];

const availabilityOptions: Array<{
  label: string;
  value: MedicineAvailability;
}> = [
  { label: 'Todos', value: 'all' },
  { label: 'Solo en stock', value: 'in_stock' },
  { label: 'Agotados', value: 'out_of_stock' },
];

export const MedicineFilterBar = () => {
  const sort = useMedicineFiltersStore((state) => state.sort);
  const availability = useMedicineFiltersStore((state) => state.availability);
  const setSort = useMedicineFiltersStore((state) => state.setSort);
  const setAvailability = useMedicineFiltersStore(
    (state) => state.setAvailability
  );

  return (
    <div className="flex w-full max-w-md gap-6 flex-wrap">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Ordenar por
        </span>
        <Select
          value={sort}
          onValueChange={(value) => setSort(value as MedicineSortOption)}
        >
          <SelectTrigger className="h-12 border-border bg-card rounded-md">
            <SelectValue placeholder="Selecciona un criterio" />
          </SelectTrigger>
          <SelectContent>
            <SelectLabel>Criterio</SelectLabel>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Disponibilidad
        </span>
        <Select
          value={availability}
          onValueChange={(value) =>
            setAvailability(value as MedicineAvailability)
          }
        >
          <SelectTrigger className="h-12 rounded-md border-border bg-card">
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectLabel>Estado</SelectLabel>
            {availabilityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
