'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import LocationModal from './LocationModal';

export default function LocationSetup() {
  const { user, status } = useCurrentUser();
  const isAuthenticated = !!user && status === 'authenticated';
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10">
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
