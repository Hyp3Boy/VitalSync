'use client';

import { useEffect } from 'react';
import { MedicineResultCard } from '@/components/features/medicines/MedicineResultCard';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { mockMedicines } from '@/lib/mocks/medicines';
import { useMedicineFiltersStore } from '@/store/useMedicineFiltersStore';
import { MedicineListResponse } from '@/types/medicine';
import { UseQueryResult } from '@tanstack/react-query';
import { toast } from 'sonner';

interface MedicineResultsProps {
  query: UseQueryResult<MedicineListResponse>;
}

const SkeletonCard = () => (
  <div className="space-y-3 rounded-2xl border border-border bg-muted/30 p-6">
    <div className="h-6 w-48 rounded-full bg-muted animate-pulse" />
    <div className="h-4 w-64 rounded-full bg-muted animate-pulse" />
    <div className="h-32 rounded-xl bg-muted animate-pulse" />
  </div>
);

export const MedicineResults = ({ query }: MedicineResultsProps) => {
  const setPage = useMedicineFiltersStore((state) => state.setPage);
  const search = useMedicineFiltersStore((state) => state.search);
  const hasSearch = Boolean(search.trim());
  const { data, isLoading, isFetching, error } = query;

  useEffect(() => {
    if (error) {
      toast.error('No pudimos obtener los resultados. Intenta más tarde.');
    }
  }, [error]);

  useEffect(() => {
    if (data && hasSearch && !isFetching) {
      toast.success(
        data.total > 0
          ? `Actualizamos ${data.total} resultado${data.total === 1 ? '' : 's'}.`
          : 'No encontramos coincidencias para tu búsqueda.'
      );
    }
  }, [data, hasSearch, isFetching]);

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-destructive">
        No pudimos obtener los resultados. Intenta de nuevo más tarde.
      </div>
    );
  }

  const items = data?.items ?? [];
  const displayItems = hasSearch ? items : mockMedicines;
  const showEmptyState =
    hasSearch && !isLoading && !isFetching && items.length === 0;
  const headingLabel = hasSearch
    ? data?.total
      ? `Resultados (${data.total})`
      : 'Sin coincidencias'
    : 'Medicinas populares';

  const handleChangePage = (pageNumber: number) => {
    if (!data) return;
    if (pageNumber < 1 || pageNumber > data.totalPages) return;
    if (pageNumber === data.page) return;
    setPage(pageNumber);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{headingLabel}</h2>
      <div className="flex flex-col gap-6">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, idx) => <SkeletonCard key={idx} />)
        ) : showEmptyState ? (
          <div className="rounded-2xl border-2 border-dashed border-primary/30 p-10 text-center">
            <p className="text-lg font-semibold">
              No se encontraron resultados
            </p>
            <p className="text-sm text-muted-foreground">
              Revisa la ortografía o intenta con el principio activo.
            </p>
          </div>
        ) : (
          displayItems.map((item) => (
            <MedicineResultCard key={item.id} medicine={item} />
          ))
        )}
      </div>

      {isFetching && !isLoading && (
        <p className="text-center text-sm text-muted-foreground">
          Actualizando resultados...
        </p>
      )}

      {data && data.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className={cn(
                  'border-border',
                  data.page === 1 && 'pointer-events-none opacity-50'
                )}
                onClick={(event) => {
                  event.preventDefault();
                  handleChangePage(data.page - 1);
                }}
              />
            </PaginationItem>
            {Array.from({ length: data.totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === data.page}
                    onClick={(event) => {
                      event.preventDefault();
                      handleChangePage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                className={cn(
                  'border-border',
                  data.page === data.totalPages &&
                    'pointer-events-none opacity-50'
                )}
                onClick={(event) => {
                  event.preventDefault();
                  handleChangePage(data.page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
