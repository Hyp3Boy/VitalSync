'use client';

import MapboxMap, {
  MapboxMapHandle,
} from '@/components/features/location/MapboxMap';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useDebounce } from '@/hooks/useDebounce';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { locationSchema } from '@/lib/validations/location';
import {
  reverseGeocode,
  searchLocations,
  type MapboxGeocodeResult,
} from '@/services/mapboxService';
import { LocationData, useLocationStore } from '@/store/useLocationStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MapPin, Target } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { notifyError, notifySuccess } from '@/lib/utils/toast';

const DEFAULT_VIEW_STATE = {
  latitude: -12.046374,
  longitude: -77.042793,
  zoom: 11,
};

const LocationSearchForm = ({
  onLocationSaved,
}: {
  onLocationSaved?: () => void;
}) => {
  const { setLocation } = useLocationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCommandListVisible, setCommandListVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<MapboxGeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<MapboxGeocodeResult | null>(null);
  const mapRef = useRef<MapboxMapHandle | null>(null);
  const mapPickController = useRef<AbortController | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 350);
  const commandRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: { address: '', city: '', postalCode: '' },
  });

  useOnClickOutside(commandRef as RefObject<HTMLElement>, () =>
    setCommandListVisible(false)
  );

  useEffect(() => {
    if (!selectedSuggestion) return;
    mapRef.current?.flyTo({
      latitude: selectedSuggestion.coordinates.latitude,
      longitude: selectedSuggestion.coordinates.longitude,
      zoom: 15,
    });
  }, [selectedSuggestion]);

  useEffect(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.trim().length < 3) {
      const frame = requestAnimationFrame(() => {
        setSuggestions([]);
        setSearchError(null);
        setIsSearching(false);
      });
      return () => cancelAnimationFrame(frame);
    }

    const controller = new AbortController();
    const frame = requestAnimationFrame(() => {
      setIsSearching(true);
      setSearchError(null);
    });

    searchLocations(debouncedSearchTerm, {
      signal: controller.signal,
      limit: 6,
    })
      .then((results) => {
        setSuggestions(results);
        if (results.length === 0) {
          setSearchError(
            'No encontramos coincidencias. Intenta con otra dirección.'
          );
        }
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        const message =
          error instanceof Error
            ? error.message
            : 'No pudimos buscar la dirección. Intenta nuevamente.';
        setSearchError(message);
        notifyError(new Error(message), message);
      })
      .finally(() => {
        setIsSearching(false);
      });

    return () => {
      cancelAnimationFrame(frame);
      controller.abort();
    };
  }, [debouncedSearchTerm]);

  const applySuggestionToForm = (suggestion: MapboxGeocodeResult) => {
    form.setValue('address', suggestion.addressLine, { shouldValidate: true });
    form.setValue('city', suggestion.city ?? '', { shouldValidate: true });
    if (suggestion.postalCode) {
      form.setValue('postalCode', suggestion.postalCode, {
        shouldValidate: true,
      });
    }
  };

  const handleSuggestionSelect = (suggestion: MapboxGeocodeResult) => {
    applySuggestionToForm(suggestion);
    setSelectedSuggestion(suggestion);
    setSearchTerm(suggestion.addressLine);
    setCommandListVisible(false);
  };

  function onSubmit(values: z.infer<typeof locationSchema>) {
    const payload: LocationData = {
      ...values,
      latitude: selectedSuggestion?.coordinates.latitude,
      longitude: selectedSuggestion?.coordinates.longitude,
    };
    setLocation(payload);
    form.reset();
    setSearchTerm('');
    setSelectedSuggestion(null);
    onLocationSaved?.();
    notifySuccess('Ubicación establecida correctamente.');
  }

  const markers = useMemo(() => {
    if (!selectedSuggestion) return [];
    return [
      {
        id: selectedSuggestion.id,
        latitude: selectedSuggestion.coordinates.latitude,
        longitude: selectedSuggestion.coordinates.longitude,
        label: selectedSuggestion.label,
      },
    ];
  }, [selectedSuggestion]);

  const handleMapClick = async ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    mapPickController.current?.abort();
    const controller = new AbortController();
    mapPickController.current = controller;
    setIsSearching(true);
    setSearchError(null);

    try {
      const result = await reverseGeocode(
        { latitude, longitude },
        { signal: controller.signal }
      );
      if (!result) {
        const message = 'No pudimos encontrar una dirección para ese punto.';
        setSearchError(message);
        notifyError(new Error(message), message);
        setSelectedSuggestion(null);
        return;
      }
      applySuggestionToForm(result);
      setSelectedSuggestion(result);
      setSearchTerm(result.addressLine);
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      const message =
        error instanceof Error
          ? error.message
          : 'No pudimos convertir ese punto en una dirección.';
      setSearchError(message);
      notifyError(new Error(message), message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="rounded-xl border-2 border-border-muted h-12">
              <FormControl>
                <div ref={commandRef} className="relative">
                  <Command>
                    <div className="relative h-full">
                      <CommandInput
                        aria-label="Buscar dirección"
                        placeholder="Escribe tu dirección o barrio"
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSearchTerm(value);
                          setCommandListVisible(Boolean(value));
                        }}
                        onFocus={() => setCommandListVisible(true)}
                        className="w-full bg-transparent px-4 py-3 text-base placeholder:text-muted-foreground border-0"
                      />
                      {isSearching && (
                        <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                      )}
                    </div>

                    <AnimatePresence>
                      {isCommandListVisible &&
                        (isSearching || debouncedSearchTerm.length > 0) && (
                          <motion.div
                            className="absolute top-full z-10 mt-3 w-full overflow-hidden rounded-2xl border-2 border-border-muted bg-card shadow-xl"
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: 'easeInOut' }}
                          >
                            <CommandList>
                              {isSearching ? (
                                <div className="flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Buscando coincidencias...
                                </div>
                              ) : suggestions.length === 0 ? (
                                <CommandEmpty>
                                  {searchError ??
                                    'No se encontraron resultados.'}
                                </CommandEmpty>
                              ) : (
                                <CommandGroup heading="Coincidencias sugeridas">
                                  {suggestions.map((suggestion, index) => (
                                    <CommandItem
                                      key={`${suggestion.id}-${index}`}
                                      value={suggestion.addressLine}
                                      onSelect={() =>
                                        handleSuggestionSelect(suggestion)
                                      }
                                      className="cursor-pointer text-left"
                                    >
                                      <MapPin className="mr-3 h-4 w-4 text-muted-foreground" />
                                      <div className="flex flex-col">
                                        <span className="text-sm font-medium text-foreground">
                                          {suggestion.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {suggestion.addressLine}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </Command>
                </div>
              </FormControl>
              <FormMessage />
              {searchError && (
                <p className="px-4 pb-1 text-xs text-destructive">
                  {searchError}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="rounded-xl border-2 border-border-muted h-12">
              <FormControl>
                <input
                  {...field}
                  placeholder="Ciudad"
                  className="w-full bg-transparent px-4 text-base placeholder:text-muted-foreground h-full rounded-xl focus-visible:ring-border-muted focus-visible:ring-2 focus-visible:box-shadow-none border-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem className="rounded-xl border-2 border-border-muted h-12">
              <FormControl>
                <input
                  {...field}
                  placeholder="Código postal"
                  className="w-full bg-transparent px-4 text-base placeholder:text-muted-foreground h-full rounded-xl focus-visible:ring-border-muted focus-visible:ring-2 focus-visible:box-shadow-none border-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <MapboxMap
          ref={mapRef}
          initialViewState={
            selectedSuggestion
              ? {
                  latitude: selectedSuggestion.coordinates.latitude,
                  longitude: selectedSuggestion.coordinates.longitude,
                  zoom: 14,
                }
              : DEFAULT_VIEW_STATE
          }
          markers={markers}
          className="h-64 w-full rounded-xl"
          onMapClick={handleMapClick}
        />

        <Button type="submit" size="lg" className="w-full text-lg">
          Guardar ubicación
        </Button>
      </form>
    </Form>
  );
};

export default function LocationModal({
  isAuthenticated,
  onLocationSaved,
  variant = 'full',
}: {
  isAuthenticated: boolean;
  onLocationSaved?: () => void;
  variant?: 'full' | 'compact';
}) {
  const { detectAndSetLocation, isLoading, error } = useLocationStore();
  const currentLocation = useLocationStore((state) => state.location);
  const [awaitingDetectResult, setAwaitingDetectResult] = useState(false);
  const isCompact = variant === 'compact';

  useEffect(() => {
    if (!onLocationSaved) return;
    if (!awaitingDetectResult) return;
    if (currentLocation) {
      onLocationSaved();
      setAwaitingDetectResult(false);
    }
  }, [awaitingDetectResult, currentLocation, onLocationSaved]);

  useEffect(() => {
    if (!awaitingDetectResult) return;
    if (!error) return;
    setAwaitingDetectResult(false);
  }, [awaitingDetectResult, error]);

  const handleDetectLocation = () => {
    setAwaitingDetectResult(true);
    detectAndSetLocation();
  };

  return (
    <section className="w-full max-w-2xl space-y-6">
      {!isCompact && (
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black">Bienvenido</h1>
          <p className="text-base">
            Detecta tu ubicación automáticamente o búscala en el mapa para
            comenzar.
          </p>
        </div>
      )}

      <div
        className={cn(
          'rounded-3xl border border-border bg-card p-8 shadow-xl',
          isCompact && 'border-transparent shadow-none'
        )}
      >
        {!isCompact && (
          <>
            <Button
              type="submit"
              size="lg"
              className="w-full text-lg"
              onClick={handleDetectLocation}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Target className="mr-2 h-5 w-5" />
              )}
              Detectar mi Ubicación
            </Button>

            {error && (
              <p className="mt-4 text-center text-sm text-destructive">{error}</p>
            )}

            <div className="relative flex items-center py-5 text-sm text-muted-foreground">
              <div className="grow border-t border-border" />
              <span className="mx-4">o</span>
              <div className="grow border-t border-border" />
            </div>
          </>
        )}

        <div className="mb-6 text-center space-y-1">
          <p className="text-xl font-bold">Buscar en el mapa</p>
          <p className="text-base text-muted-foreground">
            Completa tu dirección para personalizar tu experiencia.
          </p>
        </div>

        <LocationSearchForm onLocationSaved={onLocationSaved} />
      </div>

      {!isCompact && (
        <div className="rounded-2xl bg-[#efe8df] px-4 py-3 text-center text-sm text-[#5c3d2a]">
          Para guardar direcciones,{' '}
          {isAuthenticated ? (
            <span className="font-semibold text-primary">
              ya estás autenticado.
            </span>
          ) : (
            <>
              <Link
                href="/login"
                className="font-semibold text-primary underline-offset-2 hover:underline"
              >
                ingresa
              </Link>{' '}
              o{' '}
              <Link
                href="/login"
                className="font-semibold text-primary underline-offset-2 hover:underline"
              >
                crea una cuenta
              </Link>
              .
            </>
          )}
        </div>
      )}
    </section>
  );
}
