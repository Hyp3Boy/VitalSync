import { EmergencyContacts } from '@/components/features/emergency/EmergencyContacts';
import { EmergencyMap } from '@/components/features/emergency/EmergencyMap';

export const EmergencyPage = () => {
  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          Servicios de Emergencia
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Si estás experimentando una emergencia médica, llama de inmediato a
          los números abajo. Usa el mapa para ubicar el centro de atención más
          cercano.
        </p>
      </section>

      <div className="grid gap-10 lg:grid-cols-2">
        <EmergencyContacts />
        <EmergencyMap />
      </div>
    </div>
  );
};
