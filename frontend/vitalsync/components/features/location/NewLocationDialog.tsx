'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocationMutations } from '@/hooks/useLocationMutations';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { toast } from 'sonner';

const schema = z.object({
  label: z.string().min(2, 'Ingresa un nombre para identificar la dirección.'),
  addressLine: z.string().min(5, 'Ingresa la dirección completa.'),
  tag: z.enum(['home', 'office', 'other']),
});

type FormValues = z.infer<typeof schema>;

interface NewLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewLocationDialog = ({ open, onOpenChange }: NewLocationDialogProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { label: '', addressLine: '', tag: 'home' },
  });
  const { createMutation } = useLocationMutations();
  const { user, status } = useCurrentUser();
  const isAuthenticated = !!user && status === 'authenticated';

  const onSubmit = (values: FormValues) => {
    if (!isAuthenticated) {
      toast.error('Inicia sesión para guardar direcciones.');
      return;
    }
    createMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      onOpenChange(value);
      if (!value) form.reset();
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar nueva dirección</DialogTitle>
          <DialogDescription>
            Guarda tus direcciones frecuentes para seleccionarlas rápidamente.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre</label>
            <Input placeholder="Casa, Oficina, etc." {...form.register('label')} />
            {form.formState.errors.label && (
              <p className="text-sm text-destructive">
                {form.formState.errors.label.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Dirección</label>
            <Input
              placeholder="Av. Siempre Viva 742"
              {...form.register('addressLine')}
            />
            {form.formState.errors.addressLine && (
              <p className="text-sm text-destructive">
                {form.formState.errors.addressLine.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select
              value={form.watch('tag')}
              onValueChange={(value) => form.setValue('tag', value as FormValues['tag'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Casa</SelectItem>
                <SelectItem value="office">Oficina</SelectItem>
                <SelectItem value="other">Otra</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Guardando…' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
