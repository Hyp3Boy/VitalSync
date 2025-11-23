// src/components/features/centers/CentersView.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LocationData } from '@/store/useLocationStore';
import { useEffect, useMemo, useRef, useState } from 'react';
// import { searchCenters } from '@/services/centerService'; // Comentado para usar Mocks
import { EmergencyCenter } from '@/types/emergency';
import {
  EmptyState,
  ErrorState,
  LoadingSkeleton,
} from '@/components/ui/StateInfo';
import ClinicCard, { Clinic } from '@/components/ui/ClinicCard';
import MapboxMap, { MapboxMapHandle } from '../location/MapboxMap';

const RANGES = [5, 10, 15, 20];

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
  {
    id: '4',
    name: 'Clínica Delgado - Auna',
    address: 'Av. Angamos Oeste, Block A, Miraflores',
    distance: '2.1 km',
    type: 'Clínica',
    latitude: -12.1193,
    longitude: -77.0338,
    rating: 4.9,
    reviewsCount: 340,
  },
  {
    id: '5',
    name: 'Hospital Casimiro Ulloa',
    address: 'Av. República de Panamá 6355, Miraflores',
    distance: '4.0 km',
    type: 'Hospital',
    latitude: -12.1264,
    longitude: -77.0213,
    rating: 4.2,
    reviewsCount: 450,
  },
  {
    id: '6',
    name: 'Mi consultorio - Lenin Chavez',
    address: 'Calle Los Pinos 123, San Isidro',
    distance: '1.5 km',
    type: 'Consultorio',
    latitude: -12.103,
    longitude: -77.035,
    rating: 5.0,
    reviewsCount: 98,
  },
];

interface CentersViewProps {
  location: LocationData;
}

export default function CentersView({ location }: CentersViewProps) {
  const [range, setRange] = useState(5); // Rango inicial de 5km
  const [data, setData] = useState<Clinic[]>([]); // Cambiado a Clinic[]
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);
  const mapRef = useRef<MapboxMapHandle | null>(null);

  const userPosition = useMemo(
    () => ({
      latitude: location.latitude ?? -12.046374,
      longitude: location.longitude ?? -77.042793,
    }),
    [location.latitude, location.longitude]
  );

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);

    // Simula una llamada a la API con un retraso
    setTimeout(() => {
      // Filtra los mocks basado en el rango (simulación)
      const results = mockClinics.filter(() => Math.random() * 20 < range + 2);
      setData(results);
      if (results.length > 0) {
        setSelectedCenterId(results[0].id);
      } else {
        setSelectedCenterId(null);
      }
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchData();
  }, [range, location]);

  useEffect(() => {
    if (selectedCenterId) {
      const center = data.find((c) => c.id === selectedCenterId);
      if (center?.latitude && center?.longitude) {
        mapRef.current?.flyTo({
          latitude: center.latitude,
          longitude: center.longitude,
          zoom: 14.5,
        });
      }
    }
  }, [selectedCenterId, data]);

  const handleSelectCenter = (center: Clinic) => {
    // Cambiado a Clinic
    setSelectedCenterId(center.id);
  };

  const markers = useMemo(
    () =>
      data.map((center) => ({
        id: center.id,
        latitude: center.latitude ?? userPosition.latitude,
        longitude: center.longitude ?? userPosition.longitude,
        label: center.name.split(' - ')[0],
      })),
    [data, userPosition]
  );

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-black">Centros de Salud Cercanos</h1>
        <p className="text-muted-foreground">
          Explora hospitales, clínicas y postas médicas cerca de ti.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Filtros y Lista */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Filtros</h2>
            <div className="space-y-2">
              <Label>Radio de búsqueda</Label>
              <div className="flex items-center gap-2">
                {RANGES.map((r) => (
                  <Button
                    key={r}
                    variant={range === r ? 'default' : 'outline'}
                    onClick={() => setRange(r)}
                    className="rounded-full"
                  >
                    {r} km
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Resultados</h2>
            <div className="space-y-4">
              {isLoading ? (
                <LoadingSkeleton />
              ) : isError ? (
                <ErrorState onRetry={fetchData} />
              ) : data.length > 0 ? (
                data.map((center) => (
                  <ClinicCard
                    key={center.id}
                    clinic={center}
                    onSelect={() => handleSelectCenter(center)}
                    isActive={selectedCenterId === center.id}
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Mapa */}
        <div className="lg:col-span-2 h-[600px] bg-muted rounded-lg sticky top-24">
          <MapboxMap
            ref={mapRef}
            initialViewState={{
              latitude: userPosition.latitude,
              longitude: userPosition.longitude,
              zoom: 12,
            }}
            markers={markers}
            userLocation={userPosition}
            className="h-full w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
