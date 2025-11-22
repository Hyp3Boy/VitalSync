import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import ReactQueryProvider from '../components/providers/ReactQueryProvider';
import './globals.css';

const lexend = Lexend({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'VitalSync',
  description:
    'Nos importa tu salud, encuentra y conecta con profesionales de la salud de confianza en VitalSync.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lexend.variable} antialiased text-foreground bg-background`}
      >
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
