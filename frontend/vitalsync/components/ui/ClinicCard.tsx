import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hospital, MapPin, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface Clinic {
  id: string;
  name: string;
  address: string;
  distance: string;
  type: 'Clínica' | 'Hospital' | 'Posta' | 'Consultorio';
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviewsCount?: number;
}

interface ClinicCardProps {
  clinic: Clinic;
  onSelect?: (clinic: Clinic) => void;
  isActive?: boolean;
  href?: string;
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
  Consultorio: {
    icon: <Stethoscope className="h-5 w-5 text-purple-500" />,
    badgeVariant: 'outline' as const,
  },
};

export default function ClinicCard({ clinic, onSelect, isActive = false, href }: ClinicCardProps) {
  const { icon, badgeVariant } = typeInfo[clinic.type];
  const content = (
    <Card
      className={cn(
        'h-full cursor-pointer transition-all hover:border-primary hover:shadow-lg',
        isActive && 'border-primary shadow-lg ring-2 ring-primary/20'
      )}
    >
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg leading-tight">{clinic.name}</CardTitle>
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
        {clinic.rating && (
          <p className="mt-1 text-xs text-muted-foreground">
            ⭐ {clinic.rating.toFixed(1)} ·{' '}
            {clinic.reviewsCount ?? 0} reseñas
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(clinic)}
        className="block w-full text-left"
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={href ?? `/clinic/${clinic.id}`} passHref>
      {content}
    </Link>
  );
}
