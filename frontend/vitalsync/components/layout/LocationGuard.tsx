'use client';

import { STORAGE_KEYS } from '@/lib/constants/storage';
import { useLocationStore } from '@/store/useLocationStore';
import { Loader2 } from 'lucide-react';
import { PropsWithChildren, useEffect, useState } from 'react';
import LocationSetup from '../features/home/LocationSetup';

export const LocationGuard = ({ children }: PropsWithChildren) => {
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const location = useLocationStore((state) => state.location);
  const hydrateLocation = useLocationStore((state) => state.hydrateLocation);

  useEffect(() => {
    hydrateLocation();
    if (typeof window !== 'undefined') {
      setHasLocation(
        Boolean(window.localStorage.getItem(STORAGE_KEYS.activeLocation))
      );
    }
    setIsBootstrapped(true);
  }, [hydrateLocation]);

  useEffect(() => {
    setHasLocation(Boolean(location));
  }, [location]);

  if (!isBootstrapped) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground h-full">
        <Loader2 className="mb-4 h-6 w-6 animate-spin" />
        <p>Verificando tus preferencias de ubicación...</p>
      </div>
    );
  }

  if (!hasLocation) {
    return <LocationSetup />;
  }

  return <>{children}</>;
};
