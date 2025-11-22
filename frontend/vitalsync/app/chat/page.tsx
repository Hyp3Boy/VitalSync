import ChatWindow from '@/components/features/chat/ChatWindow';

export const metadata = {
  title: 'Chat - VitalSync',
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-10">
      <ChatWindow />
    </main>
  );
}
