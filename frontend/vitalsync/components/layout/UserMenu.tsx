'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LoadingPill = () => (
  <div className="size-11 rounded-full bg-muted/60 animate-pulse" />
);

export default function UserMenu() {
  const { user, status, query } = useCurrentUser();
  const logout = useAuthStore((state) => state.actions.logout);
  const router = useRouter();

  if (status === 'error' && !user) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => query.refetch()}
        className="flex items-center gap-2"
      >
        <RefreshCw className="size-4" />
        Reintentar
      </Button>
    );
  }

  if (!user) {
    return <LoadingPill />;
  }

  const name = user.fullName || user.email || 'Usuario';
  const email = user.email || '';
  const avatarUrl = user.profilePicturePath || undefined;
  const userInitials =
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2) || 'VS';

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative size-11 rounded-full hover:bg-muted/50
          text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <Avatar className="size-11 ring-1 ring-border/60">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="mb-2 flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-1 ring-border/60">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuItem
          className="flex items-center gap-2 text-sm"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
