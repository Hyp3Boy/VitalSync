'use client';

import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type PropsWithChildren,
} from 'react';
import Map, {
  MapRef,
  Marker,
  NavigationControl,
  type MapLayerMouseEvent,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface MapboxMapHandle {
  flyTo: (params: {
    latitude: number;
    longitude: number;
    zoom?: number;
  }) => void;
}

export interface MapboxMarker {
  id: string;
  latitude: number;
  longitude: number;
  label?: string;
}

interface MapboxMapProps extends PropsWithChildren {
  className?: string;
  initialViewState?: {
    latitude: number;
    longitude: number;
    zoom?: number;
  };
  markers?: MapboxMarker[];
  mapStyle?: string;
  onMapClick?: (coordinates: { latitude: number; longitude: number }) => void;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

const DEFAULT_STYLE = 'mapbox://styles/mapbox/streets-v12';

const MapboxMap = forwardRef<MapboxMapHandle, MapboxMapProps>(
  (
    {
      className,
      initialViewState,
      mapStyle = DEFAULT_STYLE,
      markers = [],
      onMapClick,
      children,
      userLocation,
    },
    ref
  ) => {
    const mapRef = useRef<MapRef | null>(null);
    const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    useImperativeHandle(ref, () => ({
      flyTo: ({ latitude, longitude, zoom = 14 }) => {
        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom,
          duration: 900,
        });
      },
    }));

    if (!mapboxAccessToken) {
      return (
        <div
          className={cn(
            'flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 p-6 text-center text-sm text-destructive',
            className
          )}
        >
          Configura{' '}
          <code className="font-mono text-xs">
            NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
          </code>{' '}
          para visualizar el mapa.
        </div>
      );
    }

    const handleMapClick = (event: MapLayerMouseEvent) => {
      if (!onMapClick) return;
      onMapClick({
        latitude: event.lngLat.lat,
        longitude: event.lngLat.lng,
      });
    };

    return (
      <div
        className={cn(
          'relative h-full w-full overflow-hidden rounded-2xl shadow-inner',
          className
        )}
      >
        <Map
          ref={mapRef}
          mapboxAccessToken={mapboxAccessToken}
          mapStyle={mapStyle}
          initialViewState={{
            latitude: initialViewState?.latitude ?? -12.046374,
            longitude: initialViewState?.longitude ?? -77.042793,
            zoom: initialViewState?.zoom ?? 11,
          }}
          attributionControl={false}
          reuseMaps
          onClick={handleMapClick}
        >
          <NavigationControl position="top-right" />
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              latitude={marker.latitude}
              longitude={marker.longitude}
              anchor="bottom"
            >
              <div className="flex flex-col items-center text-primary">
                <span className="rounded-full bg-primary text-primary-foreground p-2 shadow-lg ring-2 ring-background/80">
                  <MapPin className="size-4" />
                </span>
                {marker.label && (
                  <span className="mt-2 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow">
                    {marker.label}
                  </span>
                )}
              </div>
            </Marker>
          ))}
          {children}
          {userLocation && (
            <Marker
              latitude={userLocation.latitude}
              longitude={userLocation.longitude}
              anchor="center"
            >
              <div className="flex flex-col items-center">
                <span className="block size-4 rounded-full border-2 border-white bg-[#3b82f6] shadow-lg" />
                <span className="mt-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#1d4ed8] shadow">
                  Tú
                </span>
              </div>
            </Marker>
          )}
        </Map>
      </div>
    );
  }
);

MapboxMap.displayName = 'MapboxMap';

export default MapboxMap;
