// src/components/features/layout/AppHeader.tsx
'use client'; // Necesario para el hook usePathname

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Utilidad de Shadcn para unir clases
import { Bell, Settings, Stethoscope, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/doctors', label: 'Find Doctors' },
  { href: '/medicines', label: 'Medicines' },
  { href: '/symptom-guide', label: 'Symptom Guide' },
];

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="container mx-auto px-4 py-3 border-b">
      <nav className="flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Stethoscope className="h-7 w-7 text-green-600" />
            <span className="text-gray-800">MediApp</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-gray-600 hover:text-green-600 transition-colors',
                  {
                    'text-green-600 font-semibold border-b-2 border-green-600 pb-1':
                      pathname === link.href,
                  }
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-green-50 hover:bg-green-100"
          >
            <Bell className="h-5 w-5 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-green-50 hover:bg-green-100"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </Button>
          <Link href="/dashboard/profile">
            <Avatar className="ml-2">
              <AvatarFallback className="bg-orange-100">
                <User className="h-5 w-5 text-orange-500" />
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </nav>
    </header>
  );
}
