// src/components/features/home/NearbyResults.tsx
'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ClinicCard, { Clinic } from '@/components/ui/ClinicCard';
import { LocationData } from '@/store/useLocationStore';
import { AlertTriangle, ArrowRight, Filter } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import MapboxMap, { MapboxMapHandle } from '../location/MapboxMap';

// --- MOCK DATA ---
const mockClinics: Clinic[] = [
  {
    id: '1',
    name: 'Clínica Internacional - Sede San Borja',
    address: 'Av. Guardia Civil 343, San Borja',
    distance: '1.2 km',
    type: 'Clínica',
    latitude: -12.09771,
    longitude: -77.00448,
    rating: 4.8,
    reviewsCount: 214,
  },
  {
    id: '2',
    name: 'Hospital Nacional Edgardo Rebagliati Martins',
    address: 'Av. Rebagliati 490, Jesús María',
    distance: '3.5 km',
    type: 'Hospital',
    latitude: -12.08551,
    longitude: -77.0331,
    rating: 4.4,
    reviewsCount: 512,
  },
  {
    id: '3',
    name: 'Posta Médica San Isidro',
    address: 'Calle Los Laureles 245, San Isidro',
    distance: '800 m',
    type: 'Posta',
    latitude: -12.1005,
    longitude: -77.0302,
    rating: 4.1,
    reviewsCount: 138,
  },
];

// Componente para el estado de carga (Skeleton)
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
    ))}
  </div>
);

// Componente para el estado de error
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="text-center py-10 bg-gray-50 rounded-lg">
    <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
    <h3 className="mt-2 text-lg font-semibold text-foreground">
      No se pudieron cargar los resultados
    </h3>
    <p className="mt-1 text-sm text-muted-foreground">
      Hubo un problema de conexión. Por favor, inténtalo de nuevo.
    </p>
    <div className="mt-6">
      <Button onClick={onRetry}>Reintentar</Button>
    </div>
  </div>
);

// Componente para cuando no se encuentran resultados
const EmptyState = () => (
  <div className="text-center py-10 bg-gray-50 rounded-lg">
    <h3 className="text-lg font-semibold text-foreground">
      No se encontraron resultados
    </h3>
    <p className="mt-1 text-sm text-muted-foreground">
      Intenta con otra ubicación o amplía tu radio de búsqueda.
    </p>
  </div>
);

interface NearbyResultsProps {
  location: LocationData;
}

export default function NearbyResults({ location }: NearbyResultsProps) {
  // Estados para simular la llamada a la API
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<Clinic[] | null>(null);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const mapRef = useRef<MapboxMapHandle | null>(null);
  const userPosition = useMemo(
    () => ({
      latitude: location.latitude ?? -12.046374,
      longitude: location.longitude ?? -77.042793,
    }),
    [location.latitude, location.longitude]
  );

  const fetchData = () => {
    console.log('Buscando resultados para:', location.address);
    setIsLoading(true);
    setIsError(false);

    // Simula una llamada a la API con un retraso
    setTimeout(() => {
      // Para probar el estado de error, puedes descomentar la siguiente línea:
      // if (Math.random() > 0.5) { setIsError(true); setIsLoading(false); return; }

      setData(mockClinics);
      setIsLoading(false);
    }, 1000);
  };

  // useEffect se ejecuta cuando el componente se monta o cuando 'location' cambia
  useEffect(() => {
    if (location) {
      fetchData();
    }
  }, [location]);

  useEffect(() => {
    if (data && data.length > 0 && !selectedClinicId) {
      setSelectedClinicId(data[0].id);
      const first = data[0];
      if (first.latitude && first.longitude) {
        mapRef.current?.flyTo({
          latitude: first.latitude,
          longitude: first.longitude,
          zoom: 14,
        });
      }
    }
  }, [data, selectedClinicId]);

  const markers = useMemo(
    () =>
      (data ?? []).map((clinic) => ({
        id: clinic.id,
        latitude: clinic.latitude ?? userPosition.latitude,
        longitude: clinic.longitude ?? userPosition.longitude,
        label: clinic.name.split(' - ')[0],
      })),
    [data, userPosition]
  );

  const handleSelectClinic = (clinic: Clinic) => {
    setSelectedClinicId(clinic.id);
    if (clinic.latitude && clinic.longitude) {
      mapRef.current?.flyTo({
        latitude: clinic.latitude,
        longitude: clinic.longitude,
        zoom: 14.5,
      });
    }
  };

  return (
    <section className="my-12">
      <Card>
        <CardHeader className="flex items-center justify-between gap-4 pb-2">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-2xl md:text-3xl font-black">
              Cerca de ti
            </CardTitle>
            <CardDescription>
              Filtramos resultados basados en tu ubicación actual
            </CardDescription>
          </div>

          <Link
            href="/centers"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'w-fit justify-between gap-10'
            )}
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSkeleton />
          ) : isError ? (
            <ErrorState onRetry={fetchData} />
          ) : data && data.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  {data.slice(0, 3).map((clinic) => (
                    <ClinicCard
                      key={clinic.id}
                      clinic={clinic}
                      onSelect={handleSelectClinic}
                      isActive={clinic.id === selectedClinicId}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border/60 bg-muted/20 p-2 h-fit">
                <MapboxMap
                  ref={mapRef}
                  initialViewState={{
                    latitude: userPosition.latitude,
                    longitude: userPosition.longitude,
                    zoom: 12,
                  }}
                  markers={markers}
                  userLocation={userPosition}
                  className="h-[420px] rounded-2xl"
                />
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>
    </section>
  );
}
