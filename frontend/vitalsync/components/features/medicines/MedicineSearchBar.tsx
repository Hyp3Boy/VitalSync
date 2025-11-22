'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useDebounce } from '@/hooks/useDebounce';
import {
  medicineSearchSchema,
  MedicineSearchSchema,
} from '@/lib/validations/medicine';
import { useMedicineFiltersStore } from '@/store/useMedicineFiltersStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export const MedicineSearchBar = () => {
  const search = useMedicineFiltersStore((state) => state.search);
  const setSearch = useMedicineFiltersStore((state) => state.setSearch);

  const form = useForm<MedicineSearchSchema>({
    resolver: zodResolver(medicineSearchSchema),
    defaultValues: { query: search },
  });

  const queryValue = useWatch({ control: form.control, name: 'query' }) ?? '';
  const debouncedQuery = useDebounce(queryValue, 300);

  useEffect(() => {
    if (debouncedQuery !== undefined) {
      setSearch(debouncedQuery ?? '');
    }
  }, [debouncedQuery, setSearch]);

  useEffect(() => {
    form.setValue('query', search);
  }, [search, form]);

  const onSubmit = (values: MedicineSearchSchema) => {
    setSearch(values.query.trim());
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
      <label className="flex h-14 items-center rounded-md border border-border bg-card shadow-sm">
        <div className="flex items-center justify-center px-4 text-primary">
          <Search className="size-5" />
        </div>
        <Input
          {...form.register('query')}
          placeholder="Buscar por nombre de medicina o principio activo"
          className="h-full border-0 bg-transparent text-base focus-visible:ring-0"
        />
        <Button type="submit" size="sm" className="m-2 px-6">
          Buscar
        </Button>
      </label>
      {form.formState.errors.query && (
        <p className="mt-2 text-sm text-destructive">
          {form.formState.errors.query.message}
        </p>
      )}
    </form>
  );
};
