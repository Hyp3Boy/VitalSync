// src/components/features/home/QuickActions.tsx
import { Card, CardContent } from '@/components/ui/card';
import { BriefcaseMedical, Pill, Siren, Stethoscope } from 'lucide-react';
import Link from 'next/link';

const actions = [
  {
    title: 'Emergencias',
    desc: 'SAMU, Bomberos, Hospital',
    Icon: Siren,
    href: '/emergency',
    special: 'SOS',
  },
  {
    title: 'Buscar Doctor',
    desc: 'Especialidad y ubicación',
    Icon: Stethoscope,
    href: '/doctors',
  },
  {
    title: 'Buscar Medicamentos',
    desc: 'Consulta stock y precios',
    Icon: Pill,
    href: '/medicines',
  },
  {
    title: 'Guía de Síntomas',
    desc: 'Revisa tus síntomas',
    Icon: BriefcaseMedical,
    href: '/symptom-guide',
  },
];

export default function QuickActions() {
  return (
    <section>
      <h2 className="text-2xl font-black mb-4">Acciones Rápidas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map(({ title, desc, Icon, href, special }) => {
          const isEmergency = !!special;
          return (
            <Link href={href} key={title} className="block">
              <Card
                className={`text-center p-6 h-full hover:shadow-xl transition-shadow ${
                  isEmergency ? 'bg-red-50 border-red-200' : 'bg-white'
                }`}
              >
                <CardContent className="p-0 flex flex-col items-center justify-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      isEmergency
                        ? 'bg-red-500 text-white'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {special ? (
                      <span className="font-bold text-xl">{special}</span>
                    ) : (
                      <Icon className="w-8 h-8" />
                    )}
                  </div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="text-sm">{desc}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
