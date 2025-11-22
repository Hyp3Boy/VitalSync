'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  doctorFilterOptions,
  useDoctorFiltersStore,
} from '@/store/useDoctorFiltersStore';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export const DoctorFilters = () => {
  const specialty = useDoctorFiltersStore((state) => state.specialty);
  const insurance = useDoctorFiltersStore((state) => state.insurance);
  const location = useDoctorFiltersStore((state) => state.location);
  const minRating = useDoctorFiltersStore((state) => state.minRating);

  const setFilters = useDoctorFiltersStore((state) => state.setFilters);
  const resetFilters = useDoctorFiltersStore((state) => state.resetFilters);
  const setPage = useDoctorFiltersStore((state) => state.setPage);

  return (
    <Card className="sticky top-24 space-y-5 border-border/70 bg-card/95 p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">Filtros</p>
          <p className="text-sm text-muted-foreground">
            Personaliza tu búsqueda
          </p>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-primary underline-offset-4 cursor-pointer"
          onClick={resetFilters}
        >
          Limpiar
        </button>
      </div>

      <div className="space-y-6 text-sm">
        <div className="space-y-2">
          <label className="font-medium">Especialidad</label>
          <select
            value={specialty}
            onChange={(event) => setFilters({ specialty: event.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
          >
            {doctorFilterOptions.specialties.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-medium">Seguro</label>
          <select
            value={insurance}
            onChange={(event) =>
              setFilters({
                insurance: event.target
                  .value as (typeof doctorFilterOptions.insurances)[number],
              })
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
          >
            {doctorFilterOptions.insurances.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-medium">Ubicación</label>
          <select
            value={location}
            onChange={(event) => setFilters({ location: event.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
          >
            {doctorFilterOptions.locations.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-medium">Calificación mínima</label>
          <ToggleGroup
            type="single"
            value={String(minRating)}
            className="grid grid-cols-2 gap-2"
            onValueChange={(value) => {
              if (!value) return;
              setFilters({ minRating: Number(value) });
            }}
          >
            {doctorFilterOptions.ratings.map((rating) => (
              <ToggleGroupItem
                key={rating}
                value={String(rating)}
                className="font-semibold"
              >
                {rating}+ estrellas
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={() => setPage(1)}>
        Aplicar filtros
      </Button>
    </Card>
  );
};
