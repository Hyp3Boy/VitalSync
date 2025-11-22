'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDoctors } from '@/services/doctorService';
import { useDoctorFiltersStore } from '@/store/useDoctorFiltersStore';
import { DoctorQueryParams } from '@/types/doctor';

const buildQueryParams = (
  filters: Record<string, string | number>
): DoctorQueryParams => {
  const params: DoctorQueryParams = {
    page: filters.page as number,
    perPage: filters.perPage as number,
  };

  const search = String(filters.search ?? '').trim();
  if (search) params.search = search;

  if (filters.specialty && filters.specialty !== 'Todos') {
    params.specialty = filters.specialty as string;
  }

  if (filters.location && filters.location !== 'Todos') {
    params.location = filters.location as string;
  }

  if (filters.insurance && filters.insurance !== 'Todos') {
    params.insurance = filters.insurance as DoctorQueryParams['insurance'];
  }

  if (filters.minRating && Number(filters.minRating) > 0) {
    params.minRating = Number(filters.minRating);
  }

  return params;
};

export const useDoctorsQuery = () => {
  const search = useDoctorFiltersStore((state) => state.search);
  const specialty = useDoctorFiltersStore((state) => state.specialty);
  const insurance = useDoctorFiltersStore((state) => state.insurance);
  const location = useDoctorFiltersStore((state) => state.location);
  const minRating = useDoctorFiltersStore((state) => state.minRating);
  const page = useDoctorFiltersStore((state) => state.page);
  const perPage = useDoctorFiltersStore((state) => state.perPage);

  const queryParams = useMemo(
    () =>
      buildQueryParams({
        search,
        specialty,
        insurance,
        location,
        minRating,
        page,
        perPage,
      }),
    [search, specialty, insurance, location, minRating, page, perPage]
  );

  return useQuery({
    queryKey: ['doctors', queryParams],
    queryFn: () => fetchDoctors(queryParams),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });
};
