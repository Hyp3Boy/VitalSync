import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Shield, User } from 'lucide-react';
import Link from 'next/link';


export default function HomeHeader() {
  return (
    <header className="container mx-auto px-4 py-3 border-b">
      <nav className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Shield className="h-7 w-7 text-gray-700" />
          <span className="text-gray-800">MediApp</span>
        </Link>
        <div className="flex items-center gap-4">
            <ToggleGroup type="single" defaultValue="es" variant="outline" size="sm">
                <ToggleGroupItem value="es" aria-label="Español">ES</ToggleGroupItem>
                <ToggleGroupItem value="qu" aria-label="Quechua">QU</ToggleGroupItem>
            </ToggleGroup>
            <Button asChild className="bg-green-700 hover:bg-green-800">
                <Link href="/login">Log In</Link>
            </Button>
            <Avatar>
                <AvatarFallback>
                    <User className="h-5 w-5 text-gray-500"/>
                </AvatarFallback>
            </Avatar>
        </div>
      </nav>
    </header>
  );
}