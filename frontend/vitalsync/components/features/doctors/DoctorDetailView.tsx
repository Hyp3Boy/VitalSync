'use client';

import { useDoctorDetail } from '@/hooks/useDoctorDetail';
import { DoctorReviews } from '@/components/features/doctors/DoctorReviews';
import { DoctorProfileHeader } from '@/components/features/doctors/DoctorProfileHeader';
import { DoctorSchedule } from '@/components/features/doctors/DoctorSchedule';
import { DoctorLocationCard } from '@/components/features/doctors/DoctorLocationCard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

interface DoctorDetailViewProps {
  doctorId: string;
}

const DoctorDetailSkeleton = () => (
  <div className="grid gap-8 md:grid-cols-3">
    <div className="flex flex-col gap-6 md:col-span-1">
      <Card className="flex flex-col gap-6 border border-border/80 bg-card p-6 md:flex-row">
        <div className="flex flex-col items-center text-center md:w-1/3">
          <div className="size-40 rounded-full bg-muted animate-pulse" />
          <div className="mt-4 flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index} className="h-4 w-4 rounded-full bg-muted/70 animate-pulse" />
            ))}
            <span className="h-3 w-12 rounded-full bg-muted/70 animate-pulse" />
          </div>
          <div className="mt-2 h-3 w-24 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-4 w-40 rounded-full bg-muted animate-pulse" />
          <div className="h-8 w-64 rounded-full bg-muted animate-pulse" />
          <div className="flex flex-wrap gap-2 pt-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <span key={index} className="h-6 w-28 rounded-full bg-muted/80 animate-pulse" />
            ))}
          </div>
        </div>
      </Card>

      <Card className="border border-border/80 bg-card p-6">
        <div className="mb-4 h-4 w-32 rounded-full bg-muted animate-pulse" />
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-muted animate-pulse" />
          <span className="h-3 w-64 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="mt-4 h-40 w-full rounded-2xl bg-muted/30 animate-pulse" />
      </Card>

      <Card className="border border-border/80 bg-card p-6">
        <div className="mb-4 h-4 w-40 rounded-full bg-muted animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="h-3 w-40 rounded-full bg-muted animate-pulse" />
              <div className="flex gap-2">
                {Array.from({ length: 2 }).map((__, i) => (
                  <span key={i} className="h-6 w-20 rounded-md bg-muted/60 animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <div className="md:col-span-2 space-y-6">
      <Card className="border border-border/80 bg-card p-6">
        <div className="mb-6 space-y-2">
          <div className="h-5 w-48 rounded-full bg-muted animate-pulse" />
          <div className="h-3 w-64 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-border/60 bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <span className="size-10 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 rounded-full bg-muted animate-pulse" />
                  <div className="h-3 w-20 rounded-full bg-muted animate-pulse" />
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {Array.from({ length: 2 }).map((__, textIndex) => (
                  <div key={textIndex} className="h-3 w-full rounded-full bg-muted animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border border-border/80 bg-card p-6">
        <div className="mb-4 h-4 w-40 rounded-full bg-muted animate-pulse" />
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className="h-6 w-6 rounded-full bg-muted animate-pulse" />
          ))}
        </div>
        <div className="mt-4 h-24 w-full rounded-xl bg-muted/30 animate-pulse" />
        <div className="mt-3 h-9 w-32 rounded-md bg-muted animate-pulse" />
      </Card>
    </div>
  </div>
);

export const DoctorDetailView = ({ doctorId }: DoctorDetailViewProps) => {
  const { query, mutation } = useDoctorDetail(doctorId);
  const router = useRouter();
  const isLoading = query.isLoading || !query.data;

  useEffect(() => {
    if (query.isError) {
      toast.error('No pudimos cargar este perfil. Te llevaremos a doctores.');
      router.replace('/doctors');
    }
  }, [query.isError, router]);

  if (query.isError) {
    return <DoctorDetailSkeleton />;
  }

  if (isLoading) {
    return <DoctorDetailSkeleton />;
  }

  const { doctor, reviews } = query.data;

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="flex flex-col gap-6 md:col-span-1">
        <DoctorProfileHeader doctor={doctor} />
        <DoctorLocationCard doctor={doctor} />
        <DoctorSchedule schedule={doctor.schedule} />
      </div>
      <div className="md:col-span-2">
        <DoctorReviews
          reviews={reviews}
          isSubmitting={mutation.isPending}
          onSubmit={(values) => mutation.mutate(values)}
        />
      </div>
    </div>
  );
};
