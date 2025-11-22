export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-6xl">
      <main className="grow container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
