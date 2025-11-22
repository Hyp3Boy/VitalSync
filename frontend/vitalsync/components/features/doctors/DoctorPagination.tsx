'use client';

import { Button } from '@/components/ui/button';
import { useDoctorFiltersStore } from '@/store/useDoctorFiltersStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DoctorPaginationProps {
  page: number;
  totalPages: number;
}

const createRange = (current: number, total: number) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const range: Array<number | 'ellipsis'> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) range.push('ellipsis');

  for (let i = start; i <= end; i += 1) {
    range.push(i);
  }

  if (end < total - 1) range.push('ellipsis');

  range.push(total);
  return range;
};

export const DoctorPagination = ({ page, totalPages }: DoctorPaginationProps) => {
  const setPage = useDoctorFiltersStore((state) => state.setPage);
  const pages = createRange(page, totalPages);

  const handleChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    setPage(nextPage);
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Página anterior"
        disabled={page === 1}
        onClick={() => handleChange(page - 1)}
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pages.map((value, index) =>
        value === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <Button
            key={value}
            type="button"
            size="icon-sm"
            variant={value === page ? 'default' : 'ghost'}
            className={
              value === page
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground'
            }
            onClick={() => handleChange(value)}
          >
            {value}
          </Button>
        )
      )}

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Página siguiente"
        disabled={page === totalPages}
        onClick={() => handleChange(page + 1)}
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
};
