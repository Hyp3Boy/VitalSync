import { Card } from '@/components/ui/card';
import { DoctorDetail } from '@/types/doctor';
import Image from 'next/image';

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

interface DoctorProfileHeaderProps {
  doctor: DoctorDetail;
}

export const DoctorProfileHeader = ({ doctor }: DoctorProfileHeaderProps) => {
  const showImage = !!doctor.imageUrl;
  const initials = doctor.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');

  const specialties = doctor.specialties?.length
    ? doctor.specialties
    : [doctor.specialty];

  return (
    <Card className="flex flex-col gap-2 border border-border/80 bg-card p-6">
      <div className="w-full flex items-center justify-center">
        <div className="relative size-40 overflow-hidden rounded-full border-4 border-primary/20">
          {showImage ? (
            <Image
              src={doctor.imageUrl}
              alt={doctor.name}
              fill
              sizes="160px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-3xl font-bold text-primary">
              {initials}
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col justify-center items-center">
        <h1 className="mb-2 text-3xl font-black text-foreground text-center">
          {doctor.name}
        </h1>
        <div className="flex flex-wrap gap-2">
          {specialties.map((spec) => (
            <span
              key={spec}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      <div className="w-full flex gap-2 justify-center items-center">
        <svg className="size-4 text-primary fill-primary" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.955L10 0l2.95 5.955 6.562.955-4.756 4.635 1.122 6.545z" />
        </svg>
        <span className="text-sm font-semibold text-muted-foreground">
          {doctor.rating.toFixed(1)} ({doctor.ratingCount})
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground text-center">
        CMP: {doctor.cmp}
      </p>
    </Card>
  );
};
