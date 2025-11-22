import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Central de Ayuda Médica
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Encuentra la atención que necesitas, cuando la necesitas.
      </p>
      <Link href={'/chat'} className="relative max-w-2xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="search"
          placeholder="¿Qué necesitas hoy? (síntomas, doctor, clínica, etc.)"
          className="pl-10 h-12 text-base"
        />
      </Link>
    </section>
  );
}
