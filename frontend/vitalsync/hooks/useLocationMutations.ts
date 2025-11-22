'use client';

import { useMutation } from '@tanstack/react-query';
import {
  createLocation,
  CreateLocationPayload,
  deleteLocation,
  markPrimaryLocation,
} from '@/services/locationService';
import { useLocationPreferencesStore } from '@/store/useLocationPreferencesStore';
import { toast } from 'sonner';

export const useLocationMutations = () => {
  const addLocation = useLocationPreferencesStore((state) => state.addLocation);
  const removeLocation = useLocationPreferencesStore((state) => state.removeLocation);
  const markAsPrimary = useLocationPreferencesStore((state) => state.markAsPrimary);

  const createMutation = useMutation({
    mutationFn: (payload: CreateLocationPayload) => createLocation(payload),
    onSuccess: (location) => {
      addLocation(location);
      toast.success('Dirección guardada.');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'No se pudo guardar la dirección.'
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLocation(id),
    onSuccess: (_data, id) => {
      removeLocation(id);
      toast.success('Dirección eliminada.');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'No se pudo eliminar la dirección.'
      );
    },
  });

  const primaryMutation = useMutation({
    mutationFn: (id: string) => markPrimaryLocation(id),
    onSuccess: (_data, id) => {
      markAsPrimary(id);
      toast.success('Dirección predeterminada actualizada.');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'No se pudo actualizar la dirección.'
      );
    },
  });

  return { createMutation, deleteMutation, primaryMutation };
};
