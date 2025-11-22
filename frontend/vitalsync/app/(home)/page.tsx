'use client';

import HeroSection from '@/components/features/home/HeroSection';
import LocationSetup from '@/components/features/home/LocationSetup';
import NearbyResults from '@/components/features/home/NearbyMap';
import QuickActions from '@/components/features/home/QuickActions';
import { useLocationStore } from '@/store/useLocationStore';

export default function HomePage() {
  const location = useLocationStore((state) => state.location);

  return (
    <>
      {!location ? (
        <LocationSetup />
      ) : (
        <>
          <div className="container mx-auto px-4">
            <HeroSection />
          </div>
          <div className="container mx-auto px-4">
            <QuickActions />
          </div>
          <div className="container mx-auto px-4">
            <NearbyResults location={location} />
          </div>
        </>
      )}
    </>
  );
}
