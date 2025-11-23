'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserMenu from './UserMenu';
import Image from 'next/image';

const navLinks = [
  { href: '/doctors', label: 'Encuentra Doctores' },
  { href: '/medicines', label: 'Medicinas' },
  { href: '/symptom-guide', label: 'Guía de Síntomas' },
];

export default function AppHeader() {
  const pathname = usePathname();
  const { user, status } = useCurrentUser();
  const isAuthenticated = !!user && status === 'authenticated';

  const renderLink = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="container mx-auto px-4 py-5">
      <nav className="flex items-center justify-between">
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
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors',
                renderLink(link.href) && 'font-semibold '
              )}
            >
              {link.label}
            </Link>
          ))}
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
