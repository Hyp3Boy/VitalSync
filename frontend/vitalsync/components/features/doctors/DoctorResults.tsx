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
  <div className="flex flex-col rounded-2xl border border-border bg-muted/20 p-6 shadow-sm">
    <div className="flex gap-5">
      <div className="mx-auto mb-4 size-24 rounded-full bg-muted animate-pulse" />
      <div>
        <div className="mx-auto mb-2 h-4 w-full rounded-full bg-muted animate-pulse" />
        <div className="mx-auto mb-6 h-3 w-full rounded-full bg-muted animate-pulse" />
      </div>
    </div>
    <div className="mt-auto space-y-3">
      <div className="h-3 rounded-full bg-muted animate-pulse" />
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
    <div className="space-y-10">
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
