'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function UserNav() {
  const { state } = useSidebar();
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  if (state === 'collapsed') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} data-ai-hint="person" />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.displayName || 'User'}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || ''}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="w-full">
        <Button variant="ghost" className="h-auto w-full justify-start gap-3 px-2">
          <Avatar className="h-9 w-9">
             <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} data-ai-hint="person" />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left">
            <p className="text-sm font-medium">{user?.displayName || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
          </div>
        </Button>
    </div>
  );
}
