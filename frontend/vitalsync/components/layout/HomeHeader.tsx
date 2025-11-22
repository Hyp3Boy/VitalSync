'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Shield, Stethoscope, User } from 'lucide-react';
import Link from 'next/link';
import UserMenu from './UserMenu';
import { LocationSwitcher } from './LocationSwitcher';

export default function HomeHeader() {
  const { user, status } = useCurrentUser();
  const isAuthenticated = !!user && status === 'authenticated';
  return (
    <header className="container mx-auto px-4 py-3 border-b">
      <nav className="flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Stethoscope className="h-7 w-7 text-green-600" />
            <span>VitalSync</span>
          </Link>
        </div>
        <LocationSwitcher />
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
