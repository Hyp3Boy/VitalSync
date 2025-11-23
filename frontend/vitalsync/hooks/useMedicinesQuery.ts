'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMedicines } from '@/services/medicineService';
import { useMedicineFiltersStore } from '@/store/useMedicineFiltersStore';

export const useMedicinesQuery = () => {
  const search = useMedicineFiltersStore((state) => state.search);
  const sort = useMedicineFiltersStore((state) => state.sort);
  const availability = useMedicineFiltersStore((state) => state.availability);
  const page = useMedicineFiltersStore((state) => state.page);
  const perPage = useMedicineFiltersStore((state) => state.perPage);

  const queryParams = useMemo(
    () => ({ search, sort, availability, page, perPage }),
    [search, sort, availability, page, perPage]
  );

  return useQuery({
    queryKey: ['medicines', queryParams],
    queryFn: () => fetchMedicines(queryParams),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    placeholderData: (previous) => previous,
  });
};
