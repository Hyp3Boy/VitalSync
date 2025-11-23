'use client';

import { DoctorResults } from '@/components/features/doctors/DoctorResults';
import { DoctorSearchHeader } from '@/components/features/doctors/DoctorSearchHeader';
import { useDoctorSearchQuery } from '@/hooks/useDoctorSearchQuery';

export const DoctorExplorer = () => {
  const { query, pagedItems, total, totalPages } = useDoctorSearchQuery();

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <section className="w-full space-y-10">
        <DoctorSearchHeader totalResults={total} />
        <DoctorResults
          query={{
            data: {
              items: pagedItems.map((d) => ({
                id: d.id,
                name: d.name,
                specialty: d.specialties?.[0] ?? 'General',
                specialties: d.specialties ?? [],
                cmp: d.cmp,
                rating: Math.max(4, Math.min(5, d.sc_acum)),
                ratingCount: d.n_comments,
                location: '',
                insurances: [],
                imageUrl: '',
                page: 1,
                perPage: 1,
                total: total,
                totalPages: totalPages,
              })),
              total,
              page: 1,
              perPage: 1,
              totalPages,
            },
            isLoading: query.isLoading,
            isFetching: query.isFetching,
            error: query.error as any,
          } as any}
        />
      </section>
    </div>
  );
};
