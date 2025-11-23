'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUserLocations } from '@/services/locationService';
import { useLocationPreferencesStore } from '@/store/useLocationPreferencesStore';

export const useSavedLocationsQuery = (enabled: boolean) => {
  const setSavedLocations = useLocationPreferencesStore((state) => state.setSavedLocations);
  const setStatus = useLocationPreferencesStore((state) => state.setStatus);

  return useQuery({
    queryKey: ['locations'],
    queryFn: fetchUserLocations,
    enabled,
    staleTime: 1000 * 60 * 5,
    onSuccess: (locations) => {
      setSavedLocations(locations);
      setStatus({ isLoading: false, error: undefined });
    },
    onError: (error) => {
      setStatus({ isLoading: false, error: error instanceof Error ? error.message : 'No se pudo cargar tus ubicaciones.' });
    },
  });
};
