import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hospital, MapPin, Stethoscope } from 'lucide-react';
import Link from 'next/link';

export interface Clinic {
  id: string;
  name: string;
  address: string;
  distance: string;
  type: 'Clínica' | 'Hospital' | 'Posta';
}

interface ClinicCardProps {
  clinic: Clinic;
}

const typeInfo = {
  Clínica: {
    icon: <Stethoscope className="h-5 w-5 text-blue-500" />,
    badgeVariant: 'default' as const,
  },
  Hospital: {
    icon: <Hospital className="h-5 w-5 text-red-500" />,
    badgeVariant: 'destructive' as const,
  },
  Posta: {
    icon: <Stethoscope className="h-5 w-5 text-green-500" />,
    badgeVariant: 'secondary' as const,
  },
};

export default function ClinicCard({ clinic }: ClinicCardProps) {
  const { icon, badgeVariant } = typeInfo[clinic.type];

  return (
    <Link href={`/clinic/${clinic.id}`} passHref>
      <Card className="hover:shadow-lg hover:border-primary transition-all h-full flex flex-col cursor-pointer">
        <CardHeader>
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg leading-tight">
              {clinic.name}
            </CardTitle>
            <div className="shrink-0">{icon}</div>
          </div>
          <Badge variant={badgeVariant} className="w-fit">
            {clinic.type}
          </Badge>
        </CardHeader>
        <CardContent className="grow flex flex-col justify-end text-sm">
          <div className="flex items-start text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
            <span>{clinic.address}</span>
          </div>
          <p className="mt-2 font-semibold text-foreground">
            Aprox. {clinic.distance} de distancia
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
