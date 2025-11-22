import AppHeader from '@/components/layout/AppHeader';
import { LocationSwitcher } from '@/components/layout/LocationSwitcher';
import { LocationGuard } from '@/components/layout/LocationGuard';
import ToasterClient from '@/components/ui/ToasterClient';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-6xl">
      <AppHeader />
      <LocationSwitcher />
      <main className="grow container mx-auto px-4 py-8">
        <LocationGuard>{children}</LocationGuard>
      </main>
      <ToasterClient />
    </div>
  );
}
