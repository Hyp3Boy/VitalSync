import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Doctor } from '@/types/doctor';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const renderStars = (rating: number) =>
  Array.from({ length: 5 }).map((_, index) => (
    <svg
      key={index}
      className={`size-4 ${
        index < Math.round(rating)
          ? 'text-primary fill-primary'
          : 'text-primary/20'
      }`}
      viewBox="0 0 20 20"
    >
      <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.955L10 0l2.95 5.955 6.562.955-4.756 4.635 1.122 6.545z" />
    </svg>
  ));

interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard = ({ doctor }: DoctorCardProps) => {
  return (
    <Card className="h-full border-border/60 bg-card/95 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-center gap-4">
          <div
            className="size-16 rounded-full border-4 border-primary/10 bg-cover bg-center"
            style={{ backgroundImage: `url(${doctor.imageUrl})` }}
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {doctor.specialty}
            </p>
            <h3 className="text-xl font-bold text-foreground">{doctor.name}</h3>
            <p className="text-sm font-medium text-muted-foreground">
              CMP: {doctor.cmp}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-primary">
          {renderStars(doctor.rating)}
          <span className="text-xs font-medium text-muted-foreground">
            {doctor.rating.toFixed(1)} · {doctor.ratingCount} opiniones
          </span>
        </div>

        <div className="mt-auto pt-2">
          <Link
            href={`/doctors/${doctor.id}`}
            className={cn(
              buttonVariants({ size: 'sm' }),
              'w-full justify-center'
            )}
          >
            Ver Perfil
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
