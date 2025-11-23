// src/app/(main)/centers/page.tsx
'use client';
import CentersView from '@/components/features/centers/CentersView';
import { useLocationStore } from '@/store/useLocationStore';
import { useEffect } from 'react';

export default function CentersPage() {
  const { location, requestLocation } = useLocationStore();

  useEffect(() => {
    if (!location) {
      requestLocation();
    }
  }, [location, requestLocation]);

  if (!location) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Obteniendo tu ubicación...</p>
        {/* Aquí podríamos poner un spinner o skeleton más elaborado */}
      </div>
    );
  }

  return <CentersView location={location} />;
}