'use client';

import { Card } from '@/components/ui/card';
import { DoctorDetail } from '@/types/doctor';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapboxMap = dynamic(() => import('@/components/features/location/MapboxMap'), {
  ssr: false,
});

interface DoctorLocationCardProps {
  doctor: DoctorDetail;
}

export const DoctorLocationCard = ({ doctor }: DoctorLocationCardProps) => {
  const hasCoordinates = !!doctor.coordinates;

  return (
    <Card className="border border-border/80 bg-card p-6 gap-2 !important">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-lg font-semibold text-foreground">Ubicación</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="size-4 text-primary" />
        <span>{doctor.clinicAddress}</span>
      </div>

      <div className="mt-2">
        {hasCoordinates ? (
          <MapboxMap
            className="h-48 w-full"
            initialViewState={doctor.coordinates}
            markers={[
              {
                id: `doctor-${doctor.id}`,
                latitude: doctor.coordinates!.latitude,
                longitude: doctor.coordinates!.longitude,
                label: doctor.name,
              },
            ]}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/20 p-4 text-center text-xs text-muted-foreground">
            No hay mapa disponible para esta dirección.
          </div>
        )}
      </div>
    </Card>
  );
};