'use client';

import HeroSection from '@/components/features/home/HeroSection';
import LocationSetup from '@/components/features/home/LocationSetup';
import NearbyResults from '@/components/features/home/NearbyMap';
import QuickActions from '@/components/features/home/QuickActions';
import HomeHeader from '@/components/layout/HomeHeader';
import { useLocationStore } from '@/store/useLocationStore';

export default function HomePage() {
  const location = useLocationStore((state) => state.location);

  if (!location) {
    return <LocationSetup />;
  }

  return (
    <>
      <HomeHeader />
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
  );
}
