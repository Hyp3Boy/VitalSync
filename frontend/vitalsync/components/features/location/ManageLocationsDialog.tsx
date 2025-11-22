'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocationPreferencesStore } from '@/store/useLocationPreferencesStore';
import { useLocationMutations } from '@/hooks/useLocationMutations';
import { Home, Building2, MapPin, Star, Trash2 } from 'lucide-react';

const iconForTag = (tag: string) => {
  switch (tag) {
    case 'home':
      return <Home className="size-5" />;
    case 'office':
      return <Building2 className="size-5" />;
    default:
      return <MapPin className="size-5" />;
  }
};

interface ManageLocationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManageLocationsDialog = ({ open, onOpenChange }: ManageLocationsDialogProps) => {
  const savedLocations = useLocationPreferencesStore((state) => state.savedLocations);
  const { deleteMutation, primaryMutation } = useLocationMutations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Mis ubicaciones guardadas</DialogTitle>
          <DialogDescription>
            Marca tu dirección predeterminada o elimina las que ya no uses.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {savedLocations.map((location) => (
            <Card
              key={location.id}
              className={`flex items-center justify-between border ${
                location.isPrimary ? 'border-primary/60 bg-primary/5' : 'border-border'
              } p-4`}
            >
              <div className="flex items-center gap-3">
                <span className="text-primary">{iconForTag(location.tag)}</span>
                <div>
                  <p className="text-sm font-semibold">
                    {location.label}{' '}
                    {location.isPrimary && (
                      <span className="text-xs font-bold text-primary">Predeterminada</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{location.addressLine}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={location.isPrimary || primaryMutation.isPending}
                  onClick={() => primaryMutation.mutate(location.id)}
                >
                  <Star
                    className={`size-4 ${
                      location.isPrimary ? 'fill-primary text-primary' : 'text-muted-foreground'
                    }`}
                  />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(location.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
          {savedLocations.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aún no tienes direcciones guardadas.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
