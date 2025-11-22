import { Card } from '@/components/ui/card';
import { DoctorDetail } from '@/types/doctor';
import Image from 'next/image';
import { MapPin, Shield } from 'lucide-react';

const renderStars = (rating: number) =>
  Array.from({ length: 5 }).map((_, index) => (
    <svg
      key={index}
      className={`size-4 ${index < Math.round(rating) ? 'text-primary fill-primary' : 'text-primary/20'}`}
      viewBox="0 0 20 20"
    >
      <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.955L10 0l2.95 5.955 6.562.955-4.756 4.635 1.122 6.545z" />
    </svg>
  ));

interface DoctorProfileHeaderProps {
  doctor: DoctorDetail;
}

export const DoctorProfileHeader = ({ doctor }: DoctorProfileHeaderProps) => {
  return (
    <Card className="flex flex-col gap-6 border border-border/80 bg-card p-6 md:flex-row">
      <div className="flex flex-col items-center text-center md:w-1/3">
        <div className="relative size-40 overflow-hidden rounded-full border-4 border-primary/20">
          <Image
            src={doctor.imageUrl}
            alt={doctor.name}
            fill
            sizes="160px"
            className="object-cover"
          />
        </div>
        <div className="mt-4 flex items-center gap-2">
          {renderStars(doctor.rating)}
          <span className="text-sm font-semibold text-muted-foreground">
            {doctor.rating.toFixed(1)} ({doctor.ratingCount})
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">CMP: {doctor.cmp}</p>
      </div>

      <div className="md:flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {doctor.specialty}
        </p>
        <h1 className="text-3xl font-black text-foreground">{doctor.name}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {doctor.bio}
        </p>
        <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            {doctor.clinicAddress}
          </div>
          <div className="flex flex-wrap gap-2">
            {doctor.insurances.map((insurance) => (
              <span
                key={insurance}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
              >
                <Shield className="mr-1 inline size-3" />
                {insurance}
              </span>
            ))}
          </div>
          <p>Experiencia: {doctor.yearsExperience}+ años</p>
          <p>Idiomas: {doctor.languages.join(', ')}</p>
          <p>Formación: {doctor.education}</p>
        </div>
      </div>
    </Card>
  );
};
