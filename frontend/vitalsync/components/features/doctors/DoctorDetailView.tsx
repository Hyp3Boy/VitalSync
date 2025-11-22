'use client';

import { useDoctorDetail } from '@/hooks/useDoctorDetail';
import { DoctorReviews } from '@/components/features/doctors/DoctorReviews';
import { DoctorProfileHeader } from '@/components/features/doctors/DoctorProfileHeader';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

interface DoctorDetailViewProps {
  doctorId: string;
}

const DoctorDetailSkeleton = () => (
  <div className="space-y-8">
    <Card className="border border-border/70 bg-card p-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:w-1/3">
          <div className="size-40 rounded-full bg-muted animate-pulse" />
          <div className="h-4 w-32 rounded-full bg-muted animate-pulse" />
          <div className="h-3 w-20 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-4 w-24 rounded-full bg-muted animate-pulse" />
          <div className="h-6 w-56 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-3 w-full rounded-full bg-muted animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
    <Card className="border border-border/70 bg-card p-6">
      <div className="space-y-3">
        <div className="h-4 w-32 rounded-full bg-muted animate-pulse" />
        <div className="h-3 w-64 rounded-full bg-muted animate-pulse" />
        <div className="h-32 rounded-xl bg-muted animate-pulse" />
      </div>
    </Card>
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
    <div className="flex flex-col gap-8">
      <DoctorProfileHeader doctor={doctor} />
      <DoctorReviews
        reviews={reviews}
        isSubmitting={mutation.isPending}
        onSubmit={(values) => mutation.mutate(values)}
      />
    </div>
  );
};
