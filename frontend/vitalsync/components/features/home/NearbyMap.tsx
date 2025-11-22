// src/components/features/home/NearbyResults.tsx
'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ClinicCard, { Clinic } from '@/components/ui/ClinicCard';
import { LocationData } from '@/store/useLocationStore';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import MapboxMap from '../location/MapboxMap';

// --- MOCK DATA ---
const mockClinics: Clinic[] = [
  {
    id: '1',
    name: 'Clínica Internacional - Sede San Borja',
    address: 'Av. Guardia Civil 343, San Borja',
    distance: '1.2 km',
    type: 'Clínica',
  },
  {
    id: '2',
    name: 'Hospital Nacional Edgardo Rebagliati Martins',
    address: 'Av. Rebagliati 490, Jesús María',
    distance: '3.5 km',
    type: 'Hospital',
  },
  {
    id: '3',
    name: 'Posta Médica San Isidro',
    address: 'Calle Los Laureles 245, San Isidro',
    distance: '800 m',
    type: 'Posta',
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
  const [select, setSelect] = useState<string | null>(data.id);

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
    }, 1500); // 1.5 segundos de carga simulada
  };

  // useEffect se ejecuta cuando el componente se monta o cuando 'location' cambia
  useEffect(() => {
    if (location) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
  }, [location]);

  return (
    <section className="my-12">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <CardTitle className="text-2xl md:text-3xl">
                Resultados Cerca de Ti
              </CardTitle>
              <CardDescription className="mt-1">
                Clínicas y hospitales basados en:{' '}
                <span className="font-medium text-foreground">
                  {location.address}
                </span>
              </CardDescription>
            </div>
            <Link href="/search?nearby=true" passHref>
              <Button
                variant="ghost"
                className="mt-3 sm:mt-0 self-start sm:self-center"
              >
                Ver todos <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSkeleton />
          ) : isError ? (
            <ErrorState onRetry={fetchData} />
          ) : data && data.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((clinic) => (
                  <ClinicCard key={clinic.id} clinic={clinic} />
                ))}
              </div>
              <MapboxMap
                initialViewState={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  zoom: 12,
                }}
                markers={data.map((clinic) => ({
                  id: clinic.id,
                  latitude: location.latitude + (Math.random() - 0.5) * 0.1, // Simula posiciones cercanas
                  longitude: location.longitude + (Math.random() - 0.5) * 0.1, // Simula posiciones cercanas
                  title: clinic.name,
                }))}
                className="mt-8 h-64 rounded-lg"
              />
            </div>
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>
    </section>
  );
}
