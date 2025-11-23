'use client';

import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { LocationSwitcher } from './LocationSwitcher';
import UserMenu from './UserMenu';
import Image from 'next/image';

export default function HomeHeader() {
  const { user, status } = useCurrentUser();
  const isAuthenticated = !!user && status === 'authenticated';
  return (
    <header className="container mx-auto px-4 py-3">
      <nav className="flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Image
              src="/assets/images/logo.png"
              alt="VitalSync"
              width={40}
              height={40}
            />
            <span>VitalSync</span>
          </Link>
        </div>
        <div>
          <LocationSwitcher />
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Link href="/login">
              <Button size="sm" className="px-6">
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
