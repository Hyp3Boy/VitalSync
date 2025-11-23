'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchDoctors, type DoctorSearchResponse } from '@/services/doctorSearchService'
import { useDoctorFiltersStore } from '@/store/useDoctorFiltersStore'

export const useDoctorSearchQuery = () => {
  const search = useDoctorFiltersStore((s) => s.search)
  const specialty = useDoctorFiltersStore((s) => s.specialty)
  const page = useDoctorFiltersStore((s) => s.page)
  const perPage = useDoctorFiltersStore((s) => s.perPage)
  const setPage = useDoctorFiltersStore((s) => s.setPage)

  const [debounced, setDebounced] = useState(search)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 350)
    return () => clearTimeout(id)
  }, [search])

  const topK = useMemo(() => Math.min(perPage * 5, 100), [perPage])

  const query = useQuery<DoctorSearchResponse>({
    queryKey: ['doctor-search', { debounced, specialty, topK }],
    queryFn: () =>
      searchDoctors({ body: { name: debounced || undefined, specialty: specialty || undefined, top_k: topK } }),
    enabled: Boolean(debounced || specialty),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 10,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  })

  const items = query.data?.results ?? []
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const start = (page - 1) * perPage
  const pagedItems = items.slice(start, start + perPage)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages, setPage])

  return { query, pagedItems, total, totalPages }
}