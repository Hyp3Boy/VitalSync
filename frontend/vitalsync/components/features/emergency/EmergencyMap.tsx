'use client';

import MapboxMap from '@/components/features/location/MapboxMap';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';
import { useEmergencyCenters } from '@/hooks/useEmergencyCenters';
import { haversineDistanceKm } from '@/lib/utils';
import { useLocationStore } from '@/store/useLocationStore';
import { Loader2, MapPin, Siren } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

const DISTANCE_OPTIONS = [5, 10, 20, 50];

const DEFAULT_COORDS = {
  latitude: -12.046374,
  longitude: -77.042793,
};

export const EmergencyMap = () => {
  const { centers, status, error, selectedDistance, setDistance } =
    useEmergencyCenters();
  const location = useLocationStore((state) => state.location);
  const hasUserCoords =
    typeof location?.latitude === 'number' &&
    typeof location?.longitude === 'number';
  const userCoordinates = useMemo(() => {
    if (hasUserCoords) {
      return {
        latitude: location!.latitude as number,
        longitude: location!.longitude as number,
      };
    }
    return DEFAULT_COORDS;
  }, [hasUserCoords, location]);

  const centersWithDistance = useMemo(() => {
    if (!centers.length) return [];
    return centers.map((center) => {
      const distance = haversineDistanceKm(userCoordinates, {
        latitude: center.latitude,
        longitude: center.longitude,
      });
      return { center, distance };
    });
  }, [centers, userCoordinates]);

  const filteredCenters = useMemo(() => {
    if (!hasUserCoords) return centersWithDistance;
    return centersWithDistance.filter(
      ({ distance }) => distance <= selectedDistance
    );
  }, [centersWithDistance, hasUserCoords, selectedDistance]);

  const displayCenters =
    filteredCenters.length > 0 ? filteredCenters : centersWithDistance;

  const nearestCenter = displayCenters[0]?.center
    ? displayCenters.reduce((closest, current) => {
        if (!closest) return current;
        return current.distance < closest.distance ? current : closest;
      }).center
    : undefined;

  const markers = displayCenters.map(({ center }) => ({
    id: center.id,
    latitude: center.latitude,
    longitude: center.longitude,
    label: center.name,
  }));

  const isLoading = status === 'idle' || status === 'loading';

  return (
    <section className="space-y-4">
      <header className="space-y-2 px-4">
        <div className="flex items-center gap-2 text-primary">
          <Siren className="size-5" />
          <p className="text-sm font-semibold uppercase tracking-wide">
            Centros cercanos
          </p>
        </div>
        <p className="text-2xl font-bold text-foreground">
          Hospital de emergencia más cercano
        </p>
        <p className="text-sm text-muted-foreground">
          Ajusta el radio de búsqueda para encontrar ayuda en minutos. Usamos tu
          ubicación guardada para priorizar resultados.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3 px-4">
        <p className="text-sm font-semibold text-muted-foreground">
          Radio de búsqueda
        </p>
        <ToggleGroup
          type="single"
          value={String(selectedDistance)}
          onValueChange={(value) => {
            if (!value) return;
            setDistance(Number(value));
          }}
          className="rounded-full border border-border/70 bg-card px-1 py-1"
        >
          {DISTANCE_OPTIONS.map((option) => (
            <ToggleGroupItem
              key={option}
              value={String(option)}
              className="rounded-full px-3 py-1 text-xs font-semibold data-[state=on]:bg-primary data-[state=on]:text-white"
            >
              {option} km
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="px-4">
        {isLoading ? (
          <div className="flex h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 text-center text-sm text-muted-foreground">
            <Loader2 className="mb-3 h-5 w-5 animate-spin" />
            Cargando red de centros de emergencia...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-6 text-center text-sm text-destructive">
            {error}
          </div>
        ) : (
          <MapboxMap
            initialViewState={{
              latitude: userCoordinates.latitude,
              longitude: userCoordinates.longitude,
              zoom: 12,
            }}
            markers={markers}
            className="h-72"
          />
        )}

        {nearestCenter && (
          <Card className="mt-4 space-y-4 border border-border/80 bg-card p-6">
            <div className="flex items-center gap-2 text-sm uppercase text-primary">
              <MapPin className="size-4" />
              Centro preferido
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">
                {nearestCenter.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {nearestCenter.address} - {nearestCenter.district}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Teléfono: {nearestCenter.phone}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                {nearestCenter.availableBeds} camas disponibles
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-900">
                Espera aprox. {nearestCenter.waitTimeMinutes} min
              </span>
            </div>
            <Link
              href={`https://www.google.com/maps/dir/?api=1&destination=${nearestCenter.latitude},${nearestCenter.longitude}`}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ size: 'lg' }), 'w-full justify-center')}
            >
              Obtener indicaciones
            </Link>
          </Card>
        )}
      </div>
    </section>
  );
};
