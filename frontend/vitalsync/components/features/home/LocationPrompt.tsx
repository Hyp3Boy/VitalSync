'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLocationStore } from '@/store/useLocationStore';
import { MapPin } from 'lucide-react';

export default function LocationPrompt() {
  const openLocationModal = useLocationStore(
    (state) => state.openLocationModal
  );

  return (
    <section className="my-12">
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="items-center text-center">
          <MapPin className="h-10 w-10 text-green-600 mb-2" />
          <CardTitle className="text-2xl">
            ¡Personaliza tu experiencia!
          </CardTitle>
          <CardDescription className="max-w-md">
            Define tu ubicación para encontrar doctores, clínicas y farmacias
            cerca de ti al instante.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            onClick={openLocationModal}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            Definir mi Ubicación
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
