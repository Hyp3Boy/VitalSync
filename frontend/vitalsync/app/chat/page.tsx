import ChatInterface from '@/components/features/chat/ChatInterfaceFixed';

export const metadata = {
  title: 'Chat - VitalSync',
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--background)]">
      <ChatInterface />
    </main>
  );
}
