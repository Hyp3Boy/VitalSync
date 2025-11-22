'use client';

import { useEffect } from 'react';
import { useEmergencyStore } from '@/store/useEmergencyStore';

export const useEmergencyCenters = () => {
  const centers = useEmergencyStore((state) => state.centers);
  const status = useEmergencyStore((state) => state.status);
  const error = useEmergencyStore((state) => state.error);
  const selectedDistance = useEmergencyStore(
    (state) => state.selectedDistance
  );
  const { loadCenters, setDistance } = useEmergencyStore(
    (state) => state.actions
  );

  useEffect(() => {
    if (status === 'idle') {
      void loadCenters();
    }
  }, [status, loadCenters]);

  return {
    centers,
    status,
    error,
    selectedDistance,
    loadCenters,
    setDistance,
  };
};
