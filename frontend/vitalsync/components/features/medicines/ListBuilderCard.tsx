'use client';

import { useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdvancedMedicineStore } from '@/store/useAdvancedMedicineStore';
import { useAdvancedListSearch } from '@/hooks/useAdvancedMedicineSearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, X } from 'lucide-react';

const medicineItemSchema = z.object({
  name: z.string().min(2, 'Ingresa al menos 2 caracteres.'),
  quantity: z.coerce.number().int().min(1, 'Mínimo 1').max(999, 'Máximo 999'),
});

const schema = z.object({
  newItemName: z.string().optional(),
  newItemQuantity: z.coerce
    .number()
    .int()
    .min(1, 'La cantidad mínima es 1')
    .max(999, 'Máximo 999')
    .optional(),
  newItemUnit: z.string().optional(),
  listItems: z
    .array(medicineItemSchema)
    .min(1, 'Agrega al menos una medicina.'),
});

type ListFormValues = z.infer<typeof schema>;

export const ListBuilderCard = () => {
  const mutation = useAdvancedListSearch();
  const setMedicines = useAdvancedMedicineStore((state) => state.setMedicines);
  const listFromStore = useAdvancedMedicineStore((state) => state.medicines);

  const form = useForm<ListFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      newItemName: '',
      newItemQuantity: 1,
      newItemUnit: 'gramos',
      listItems: listFromStore,
    },
  } as any);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'listItems',
  });

  const listValues =
    useWatch({ control: form.control, name: 'listItems' }) || [];

  useEffect(() => {
    setMedicines(listValues);
  }, [listValues, setMedicines]);

  const addItem = () => {
    const name = form.getValues('newItemName')?.trim();
    const quantity = form.getValues('newItemQuantity') ?? 1;

    if (!name) {
      form.setError('newItemName', {
        message: 'Ingresa el nombre de la medicina',
      });
      return;
    }

    append({ name, quantity });
    form.setValue('newItemName', '');
    form.setValue('newItemQuantity', 1);
  };

  const onSubmit = (values: ListFormValues) => {
    mutation.mutate({ medicines: values.listItems });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl text-primary">📝</span>
        <h3 className="text-2xl font-bold">Crear Lista de Medicinas</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Añade varios medicamentos para buscarlos todos a la vez.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Nombre de la medicina"
          {...form.register('newItemName')}
        />
        <Input
          type="number"
          min={1}
          max={999}
          className="sm:w-32"
          placeholder="Cantidad"
          {...form.register('newItemQuantity')}
        />
        <Input
          type="text"
          className="sm:w-32"
          placeholder="Unidad (opcional)"
          {...form.register('newItemUnit')}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={addItem}
          className="shrink-0"
        >
          Añadir
        </Button>
      </div>
      {form.formState.errors.newItemName && (
        <p className="text-sm text-destructive">
          {form.formState.errors.newItemName.message}
        </p>
      )}
      {form.formState.errors.newItemQuantity && (
        <p className="text-sm text-destructive">
          {form.formState.errors.newItemQuantity.message}
        </p>
      )}

      <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border px-4 py-3">
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Agrega tus medicinas para buscarlas simultáneamente.
          </p>
        )}
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">
                {listValues[index]?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Cantidad: {listValues[index]?.quantity}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => remove(index)}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      {form.formState.errors.listItems && (
        <p className="text-sm text-destructive">
          {form.formState.errors.listItems.message}
        </p>
      )}

      <Button type="submit" disabled={mutation.isPending || !fields.length}>
        {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
        Buscar Medicinas
      </Button>
    </form>
  );
};
