'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLocationStore } from '@/store/useLocationStore';
import { useLocationPreferencesStore } from '@/store/useLocationPreferencesStore';
import { useSavedLocationsQuery } from '@/hooks/useSavedLocationsQuery';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import {
  MapPin,
  Plus,
  Settings2,
  Navigation,
  Home,
  Building2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { NewLocationDialog } from '@/components/features/location/NewLocationDialog';
import { ManageLocationsDialog } from '@/components/features/location/ManageLocationsDialog';

const locationTagIcon = (tag: string) => {
  switch (tag) {
    case 'home':
      return <Home className="size-4" />;
    case 'office':
      return <Building2 className="size-4" />;
    default:
      return <MapPin className="size-4" />;
  }
};

export const LocationSwitcher = () => {
  const { user, status } = useCurrentUser();
  const isAuthenticated = !!user && status === 'authenticated';
  useSavedLocationsQuery(isAuthenticated);
  const savedLocations = useLocationPreferencesStore(
    (state) => state.savedLocations
  );
  const selectLocation = useLocationPreferencesStore(
    (state) => state.selectLocation
  );
  const selectedLocation = useLocationPreferencesStore(
    (state) => state.selectedLocation
  );
  const setLocation = useLocationStore((state) => state.setLocation);
  const detectLocation = useLocationStore(
    (state) => state.detectAndSetLocation
  );
  const openLocationModal = useLocationStore(
    (state) => state.openLocationModal
  );
  const manualLocation = useLocationStore((state) => state.location);
  const [isNewDialogOpen, setNewDialogOpen] = useState(false);
  const [isManageDialogOpen, setManageDialogOpen] = useState(false);

  const currentLabel = useMemo(() => {
    if (manualLocation?.address) return manualLocation.address;
    if (selectedLocation) return selectedLocation.addressLine;
    return 'Selecciona tu ubicación';
  }, [manualLocation?.address, selectedLocation]);

  const handleSelectLocation = (locationId: string) => {
    const location = savedLocations.find((loc) => loc.id === locationId);
    if (!location) return;
    selectLocation(location);
    setLocation({
      address: location.addressLine,
      city: '',
      postalCode: '',
    });
  };

  return (
    <div className="container mx-auto flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full rounded-full border-border bg-card text-left text-sm font-medium px-4 py-2 md:w-auto md:px-3"
          >
            <MapPin className="mr-2 size-4 text-primary" />
            <span className="truncate">Mi ubicación: {currentLabel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 p-2" align="start">
          <DropdownMenuItem
            className="flex items-center gap-2 rounded-lg"
            onSelect={(event) => {
              event.preventDefault();
              detectLocation();
            }}
          >
            <Navigation className="size-4 text-primary" />
            Detectar mi ubicación
          </DropdownMenuItem>

          {isAuthenticated ? (
            <>
              <DropdownMenuLabel className="mt-2 text-xs font-semibold text-muted-foreground">
                Mis ubicaciones guardadas
              </DropdownMenuLabel>
              {savedLocations.length === 0 && (
                <p className="px-2 text-xs text-muted-foreground">
                  Aún no tienes direcciones guardadas.
                </p>
              )}
              {savedLocations.map((location) => (
                <DropdownMenuItem
                  key={location.id}
                  onSelect={(event) => {
                    event.preventDefault();
                    handleSelectLocation(location.id);
                  }}
                  className="flex items-start gap-3 hover:bg-primary/10"
                >
                  <span className="mt-0.5 text-primary">
                    {locationTagIcon(location.tag)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {location.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {location.addressLine}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setNewDialogOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="size-4" /> Ingresar nueva dirección
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onSelect={(event) => {
                  event.preventDefault();
                  setManageDialogOpen(true);
                }}
              >
                <Settings2 className="size-4" /> Administrar ubicaciones
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  openLocationModal();
                }}
                className="mt-2 flex items-center gap-2"
              >
                <Plus className="size-4" /> Ingresar nueva dirección
              </DropdownMenuItem>
              <div className="space-y-1 px-2 py-3 text-xs text-muted-foreground">
                <p>Detecta tu ubicación o ingresa una nueva dirección.</p>
                <p className="text-primary font-medium">
                  Inicia sesión para guardar tus ubicaciones.
                </p>
              </div>
            </>
          )}
        </DropdownMenuContent>
        <NewLocationDialog
          open={isNewDialogOpen}
          onOpenChange={setNewDialogOpen}
        />
        <ManageLocationsDialog
          open={isManageDialogOpen}
          onOpenChange={setManageDialogOpen}
        />
      </DropdownMenu>
    </div>
  );
};
