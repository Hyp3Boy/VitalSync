'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CarFront } from 'lucide-react';
import type mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';

type EmergencyMapProps = {
  latitude: number;
  longitude: number;
  facilityName: string;
  address: string;
  travelTime: string;
};

export const EmergencyMap = ({
  latitude,
  longitude,
  facilityName,
  address,
  travelTime,
}: EmergencyMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapsUrl, setMapsUrl] = useState('');

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;

    if (/android|iphone|ipad|ipod/i.test(userAgent)) {
      setMapsUrl(
        `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`
      );
    } else {
      setMapsUrl(
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      );
    }

    let isMounted = true;

    (async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default;
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

        if (!token) {
          setMapError(
            'Agrega NEXT_PUBLIC_MAPBOX_TOKEN para visualizar el mapa.'
          );
          return;
        }

        mapboxgl.accessToken = token;

        if (!mapContainerRef.current) return;

        mapInstanceRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [longitude, latitude],
          zoom: 13,
        });

        new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup().setText(facilityName))
          .addTo(mapInstanceRef.current);
      } catch (error) {
        console.error('Error al cargar Mapbox', error);
        if (isMounted) {
          setMapError('No pudimos cargar el mapa. Intenta nuevamente.');
        }
      }
    })();

    return () => {
      isMounted = false;
      mapInstanceRef.current?.remove();
    };
  }, [latitude, longitude, facilityName]);

  return (
    <section className="space-y-4">
      <header className="space-y-2 px-4">
        <p className="text-2xl font-bold text-foreground">
          Hospital de emergencia más cercano
        </p>
        <p className="text-sm text-muted-foreground">
          Usa el mapa para ubicar rápidamente el centro de atención urgente más
          próximo.
        </p>
      </header>

      <div className="px-4">
        <div className="overflow-hidden rounded-2xl border border-border/80">
          <div
            ref={mapContainerRef}
            className="w-full"
            style={{ height: 320 }}
            aria-label="Mapa de centros de emergencia"
          />
          {mapError && (
            <div className="border-t border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              {mapError}
            </div>
          )}
        </div>

        <Card className="mt-4 space-y-3 border border-border/80 bg-card p-6">
          <div>
            <p className="text-xl font-bold text-foreground">{facilityName}</p>
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CarFront className="size-4" />
            {travelTime}
          </div>
          <Button size="lg" className="w-full" asChild>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
              target="_blank"
              rel="noreferrer"
            >
              Obtener indicaciones
            </a>
          </Button>
        </Card>
      </div>
    </section>
  );
};
