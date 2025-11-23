import AppHeader from '@/components/layout/AppHeader';
import { LocationSwitcher } from '@/components/layout/LocationSwitcher';
import ToasterClient from '@/components/ui/ToasterClient';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-6xl">
      <AppHeader />
      <div className="mt-4">
        <LocationSwitcher />
      </div>
      <main className="grow container mx-auto p-4">{children}</main>
      <ToasterClient />
    </div>
  );
}
