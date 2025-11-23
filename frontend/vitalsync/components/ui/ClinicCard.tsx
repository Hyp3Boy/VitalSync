import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hospital, MapPin, Stethoscope, Navigation } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface Clinic {
  id: string;
  name: string;
  address: string;
  distance: string;
  type: 'Clínica' | 'Hospital' | 'Posta';
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviewsCount?: number;
  phone?: string;
  hours?: string;
  specialties?: string[];
  services?: string[];
  directionsHref?: string;
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
      <CardContent className="grow flex flex-col gap-2 text-sm">
        <div className="flex items-start text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
          <span>{clinic.address}</span>
        </div>
        <p className="font-semibold text-foreground">
          Aprox. {clinic.distance} de distancia
        </p>
        {clinic.phone && (
          <p className="text-xs text-muted-foreground">📞 {clinic.phone}</p>
        )}
        {clinic.hours && (
          <p className="text-xs text-muted-foreground">⏰ {clinic.hours}</p>
        )}
        {(clinic.specialties?.length || 0) > 0 && (
          <div className="flex flex-wrap gap-1">
            {(clinic.specialties ?? []).slice(0, 3).map((s) => (
              <Badge key={s} variant="secondary" className="text-[10px]">
                {s}
              </Badge>
            ))}
          </div>
        )}
        {(clinic.services?.length || 0) > 0 && (
          <div className="flex flex-wrap gap-1">
            {(clinic.services ?? []).slice(0, 3).map((s) => (
              <Badge key={s} variant="outline" className="text-[10px]">
                {s}
              </Badge>
            ))}
          </div>
        )}
        {clinic.rating && (
          <p className="mt-1 text-xs text-muted-foreground">
            ⭐ {clinic.rating.toFixed(1)} ·{' '}
            {clinic.reviewsCount ?? 0} reseñas
          </p>
        )}
        {clinic.directionsHref && (
          <div className="pt-1">
            <a
              href={clinic.directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
            >
              <Navigation className="h-3 w-3" /> Indicaciones
            </a>
          </div>
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
