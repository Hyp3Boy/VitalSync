'use client';

import { DoctorFilters } from '@/components/features/doctors/DoctorFilters';
import { DoctorResults } from '@/components/features/doctors/DoctorResults';
import { DoctorSearchHeader } from '@/components/features/doctors/DoctorSearchHeader';
import { useDoctorsQuery } from '@/hooks/useDoctorsQuery';

export const DoctorExplorer = () => {
  const doctorsQuery = useDoctorsQuery();

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <section className="w-full space-y-10">
        <DoctorSearchHeader totalResults={doctorsQuery.data?.total ?? 0} />
        <DoctorResults query={doctorsQuery} />
      </section>
    </div>
  );
};
