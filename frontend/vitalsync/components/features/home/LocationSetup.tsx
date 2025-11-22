'use client';

import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import LocationModal from './LocationModal';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function LocationSetup() {
  const { user, status } = useCurrentUser();
  const isAuthenticated = !!user && status === 'authenticated';
  return (
    <div className="min-h-screen bg-[#fdf7ed] flex flex-col justify-center items-center px-4 py-10">
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <LocationModal isAuthenticated={isAuthenticated} />
      </Suspense>
    </div>
  );
}
