'use client';

import { Button } from '@/components/ui/button';
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
import { LocationData, useLocationStore } from '@/store/useLocationStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MapPin, SearchIcon, Target } from 'lucide-react';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

// Mock data (en un caso real, vendría de una API)
const mockAddresses = [
  'Av. Arequipa 520, Lima 15046',
  'Calle Schell 310, Miraflores 15074',
  'Jirón de la Unión 899, Lima 15001',
  'Av. Angamos Este 2500, Surquillo 15038',
];

// --- Componente del formulario de búsqueda ---
const LocationSearchForm = () => {
  const { setLocation } = useLocationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCommandListVisible, setCommandListVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Aplicamos el debounce al término de búsqueda
  const debouncedSearchTerm = useDebounce(searchTerm, 350);
  const commandRef = useRef(null) as RefObject<HTMLElement>;

  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: { address: '', city: '', postalCode: '' },
  });

  useOnClickOutside(commandRef, () => setCommandListVisible(false));

  useEffect(() => {
    let isCancelled = false;

    if (!debouncedSearchTerm) {
      setSuggestions([]);
      setIsSearching(false);
      setCommandListVisible(false);
      return;
    }

    setIsSearching(true);

    const handler = setTimeout(() => {
      if (isCancelled) return;
      const filtered = mockAddresses.filter((addr) =>
        addr.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setSuggestions(filtered);
      setIsSearching(false);
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(handler);
    };
  }, [debouncedSearchTerm]);

  const handleSuggestionSelect = (address: string) => {
    const parts = address.split(',');
    const postalCodeMatch = address.match(/\d{5}/);

    form.setValue('address', address, { shouldValidate: true });

    if (parts.length > 1) {
      const city = parts[1].trim().split(' ')[0];
      form.setValue('city', city ?? '', { shouldValidate: true });
    }
    if (postalCodeMatch) {
      form.setValue('postalCode', postalCodeMatch[0], { shouldValidate: true });
    }

    setSearchTerm(address); // Sincroniza el término de búsqueda con la selección
    setCommandListVisible(false); // Oculta la lista
  };

  function onSubmit(values: z.infer<typeof locationSchema>) {
    console.log('Formulario enviado:', values);
    setLocation(values as LocationData);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div ref={commandRef} className="relative">
                  <Command className="overflow-visible rounded-2xl border border-border-muted bg-card/80 shadow-soft backdrop-blur">
                    <div className="relative">
                      <SearchIcon className="pointer-events-none absolute left-4 h-5 w-5 text-muted-foreground" />
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
                        className="h-14 w-full rounded-2xl border-none bg-transparent pl-12 pr-12 text-base placeholder:text-text-tertiary"
                      />
                      {isSearching && (
                        <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                      )}
                    </div>

                    <AnimatePresence>
                      {isCommandListVisible &&
                        (isSearching || debouncedSearchTerm.length > 0) && (
                          <motion.div
                            className="absolute top-full z-10 mt-3 w-full overflow-hidden rounded-2xl border border-border-muted bg-card shadow-xl"
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
                                  No se encontraron resultados.
                                </CommandEmpty>
                              ) : (
                                <CommandGroup heading="Coincidencias sugeridas">
                                  {suggestions.map((s) => (
                                    <CommandItem
                                      key={s}
                                      value={s}
                                      onSelect={handleSuggestionSelect}
                                      className="cursor-pointer text-left"
                                    >
                                      <MapPin className="mr-3 h-4 w-4 text-muted-foreground" />
                                      <div className="flex flex-col">
                                        <span className="text-sm font-medium text-foreground">
                                          {s.split(',')[0]}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {s}
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
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full bg-brand-green hover:bg-brand-green-hover text-lg h-12"
        >
          Continuar
        </Button>
      </form>
    </Form>
  );
};

// --- Componente Principal del Modal ---
export default function LocationModal() {
  const { detectAndSetLocation, isLoading, error } = useLocationStore();

  return (
    <section className="md:min-w-md">
      <div className="text-center items-center">
        <h1 className="text-3xl md:text-4xl font-black mb-3">
          Configura tu Ubicación
        </h1>
        <p className="text-text-secondary">
          Para encontrar médicos y servicios cerca de ti.
        </p>
      </div>

      <div className="flex flex-col gap-4 py-10">
        <Button
          size="lg"
          className="text-lg h-14"
          onClick={detectAndSetLocation}
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
          <p className="text-sm text-center text-destructive">{error}</p>
        )}

        <div className="relative flex py-5 items-center">
          <div className="grow border-t"></div>
          <span className="shrink mx-4 text-sm text-muted-foreground">
            o ingresa tu ubicación manualmente
          </span>
          <div className="grow border-t"></div>
        </div>

        <LocationSearchForm />
      </div>
    </section>
  );
}
