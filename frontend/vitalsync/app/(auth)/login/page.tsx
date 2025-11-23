'use client';

import { AuthForm } from '@/components/features/authentication/AuthForm';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuthStore } from '@/store/useAuthStore';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { user, status } = useCurrentUser();
  const { logout } = useAuthStore((state) => state.actions);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const isAuthenticatedClientSide =
    isClient && status === 'authenticated' && Boolean(user);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsClient(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!isAuthenticatedClientSide || !user) return;
    const timeout = setTimeout(() => router.push('/'), 3000);
    return () => clearTimeout(timeout);
  }, [isAuthenticatedClientSide, user, router]);

  if (isAuthenticatedClientSide && user) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-foreground">
          Ya has iniciado sesión como {user.fullName || user.email}.
        </h1>
        <p className="mt-4 text-center text-foreground/70">
          Si deseas iniciar sesión con otra cuenta, cierra sesión primero.
        </p>
        <button
          onClick={() => logout()}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Cierra sesión y vuelve a intentarlo
        </button>
        <p className="mt-3 text-sm text-muted-foreground">Serás redirigido al inicio en 3 segundos.</p>
      </div>
    );
  }
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-lg">
        <header className="flex w-full items-center justify-center gap-3 py-8 text-center text-brown-accent">
          <Image
            src="/assets/images/logo.png"
            alt="VitalSync Logo"
            width={40}
            height={40}
          />
          <h1 className="text-3xl font-bold tracking-tight">VitalSync</h1>
        </header>
        <AuthForm />
      </div>
    </div>
  );
}
