'use client';

import { DoctorCard } from '@/components/features/doctors/DoctorCard';
import { DoctorPagination } from '@/components/features/doctors/DoctorPagination';
import { useDoctorFiltersStore } from '@/store/useDoctorFiltersStore';
import { DoctorListResponse } from '@/types/doctor';
import { UseQueryResult } from '@tanstack/react-query';

interface DoctorResultsProps {
  query: UseQueryResult<DoctorListResponse>;
}

const SkeletonCard = () => (
  <div className="flex h-full flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm">
    <div className="flex items-center gap-4">
      <span className="size-16 rounded-full bg-muted animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/3 rounded-full bg-muted animate-pulse" />
        <div className="h-4 w-3/4 rounded-full bg-muted animate-pulse" />
        <div className="h-3 w-1/2 rounded-full bg-muted animate-pulse" />
      </div>
    </div>
    <div className="flex items-center gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className="size-4 rounded-full bg-muted/70 animate-pulse"
        />
      ))}
      <span className="h-3 w-24 rounded-full bg-muted/70 animate-pulse" />
    </div>
    <div className="mt-auto pt-2">
      <div className="h-10 rounded-full bg-muted animate-pulse" />
    </div>
  </div>
);

export const DoctorResults = ({ query }: DoctorResultsProps) => {
  const currentPage = useDoctorFiltersStore((state) => state.page);
  const { data, isLoading, isFetching, error } = query;

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-destructive">
        Ocurrió un error al cargar los doctores. Intenta nuevamente más tarde.
      </div>
    );
  }

  const doctors = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-10 pb-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : doctors.length > 0 ? (
          doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <p className="text-lg font-semibold text-foreground">
              No encontramos doctores para tu búsqueda.
            </p>
            <p className="text-sm text-muted-foreground">
              Ajusta los filtros o intenta con otra especialidad.
            </p>
          </div>
        )}
      </div>

      {isFetching && !isLoading && (
        <p className="text-center text-sm text-muted-foreground">
          Actualizando resultados...
        </p>
      )}

      {doctors.length > 0 && data && (
        <DoctorPagination
          page={data?.page ?? currentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};
