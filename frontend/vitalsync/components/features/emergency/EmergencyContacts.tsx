import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Ambulance, Siren, type LucideIcon } from 'lucide-react';

type Contact = {
  id: string;
  name: string;
  shortNumber: string;
  description: string;
  icon: LucideIcon;
};

const contacts: Contact[] = [
  {
    id: 'samu',
    name: 'SAMU',
    shortNumber: '106',
    description: 'Servicio de Atención Médica de Urgencia',
    icon: Ambulance,
  },
  {
    id: 'firefighters',
    name: 'Bomberos',
    shortNumber: '116',
    description: 'Cuerpo General de Bomberos Voluntarios del Perú',
    icon: Siren,
  },
];

export const EmergencyContacts = () => {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-2xl font-bold text-foreground">
          Para situaciones de riesgo inminente
        </p>
        <p className="text-sm text-muted-foreground">
          Llama inmediatamente a cualquiera de estos números nacionales.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        {contacts.map((contact) => (
          <Card
            key={contact.id}
            className="flex flex-col gap-4 border border-border/80 bg-card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <contact.icon className="size-6" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">
                  {contact.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {contact.description}
                </p>
                <p className="text-4xl font-black tracking-tight text-destructive">
                  {contact.shortNumber}
                </p>
              </div>
            </div>

            <a
              className={cn(
                buttonVariants({ size: 'sm' }),
                'w-full justify-center'
              )}
              href={`tel:${contact.shortNumber}`}
            >
              Llamar ahora
            </a>
          </Card>
        ))}
      </div>
    </section>
  );
};
