'use client';

import MapboxMap, {
  MapboxMapHandle,
} from '@/components/features/location/MapboxMap';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useEmergencyCenters } from '@/hooks/useEmergencyCenters';
import { haversineDistanceKm } from '@/lib/utils';
import { useLocationStore } from '@/store/useLocationStore';
import { Loader2, MapPin, Siren } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { UseEmblaCarouselType } from 'embla-carousel-react';

type CarouselApi = UseEmblaCarouselType[1];

const DISTANCE_OPTIONS = [5, 10, 20, 50];

const DEFAULT_COORDS = {
  latitude: -12.046374,
  longitude: -77.042793,
};

export const EmergencyMap = () => {
  const { centers, status, error, selectedDistance, setDistance } =
    useEmergencyCenters();
  const mapRef = useRef<MapboxMapHandle | null>(null);
  const [highlightedCenterId, setHighlightedCenterId] = useState<string | null>(
    null
  );
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
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
    if (!centers?.length) return [];
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

  const sortedCenters = useMemo(
    () => [...displayCenters].sort((a, b) => a.distance - b.distance),
    [displayCenters]
  );

  const topCenters = sortedCenters.slice(0, 3);

  const markers = topCenters.map(({ center }) => ({
    id: center.id,
    latitude: center.latitude,
    longitude: center.longitude,
    label: center.name,
  }));

  const isLoading = status === 'idle' || status === 'loading';

  const highlightCenter = useCallback(
    (centerId: string) => {
      const center = topCenters.find(
        ({ center }) => center.id === centerId
      )?.center;
      if (!center) return;
      setHighlightedCenterId(centerId);
      mapRef.current?.flyTo({
        latitude: center.latitude,
        longitude: center.longitude,
        zoom: 14,
      });
    },
    [topCenters]
  );

  useEffect(() => {
    if (!carouselApi) return;
    const handleSelect = () => {
      const index = carouselApi.selectedScrollSnap();
      const target = topCenters[index]?.center;
      if (target) {
        highlightCenter(target.id);
      }
    };
    carouselApi.on('select', handleSelect);
    handleSelect();
    return () => {
      carouselApi.off('select', handleSelect);
    };
  }, [carouselApi, highlightCenter, topCenters]);

  useEffect(() => {
    if (!highlightedCenterId && topCenters[0]) {
      highlightCenter(topCenters[0].center.id);
    }
  }, [highlightCenter, highlightedCenterId, topCenters]);

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <p className="text-2xl font-bold text-foreground">
          Hospital de emergencia más cercano
        </p>
        <p className="text-sm text-muted-foreground">
          Usamos tu ubicación guardada para priorizar resultados.
        </p>
      </header>

      <div className="space-y-4">
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
            ref={mapRef}
            initialViewState={{
              latitude: userCoordinates.latitude,
              longitude: userCoordinates.longitude,
              zoom: 12,
            }}
            markers={markers}
            className="h-72"
          />
        )}

        {!isLoading && !error && topCenters.length > 0 && (
          <Card className="mt-4 border border-border/80 bg-card p-6 gap-0 !important">
            <div className="flex items-center gap-2 text-sm uppercase text-primary">
              <MapPin className="size-4" />
              Centros recomendados
            </div>
            <Carousel
              className="relative mt-4 w-full"
              opts={{ align: 'start', skipSnaps: true }}
              setApi={setCarouselApi}
            >
              <CarouselContent>
                {topCenters.map(({ center, distance }) => (
                  <CarouselItem key={center.id} className="basis-full">
                    <div
                      onMouseEnter={() => highlightCenter(center.id)}
                      onFocus={() => highlightCenter(center.id)}
                      className="flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-card/80 px-4 py-4"
                      tabIndex={0}
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          A {distance.toFixed(1)} km · {center.district}
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {center.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {center.address}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                          {center.availableBeds} camas disponibles
                        </span>
                        <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-900">
                          Espera aprox. {center.waitTimeMinutes} min
                        </span>
                      </div>
                      <Link
                        href={`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                          buttonVariants({ size: 'lg' }),
                          'w-full justify-center'
                        )}
                      >
                        Obtener indicaciones
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </Card>
        )}
      </div>
    </section>
  );
};
