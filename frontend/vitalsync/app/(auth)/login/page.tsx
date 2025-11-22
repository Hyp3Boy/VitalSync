// src/app/(auth)/login/page.tsx
import { AuthForm } from '@/components/features/authentication/AuthForm';

// Usamos Heroicons para el ícono del logo
import { ClipboardDocumentListIcon } from '@heroicons/react/24/solid';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-lg">
        <header className="flex w-full items-center justify-center gap-3 py-8 text-center text-brown-accent dark:text-[#f0e6c8]">
          <div className="size-10 text-primary">
            <ClipboardDocumentListIcon />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">VitalSync</h1>
        </header>
        <AuthForm />
      </div>
    </div>
  );
}
