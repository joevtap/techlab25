import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarImage } from './ui/avatar';
import { LogOut } from 'lucide-react';

import { createAvatar } from '@dicebear/core';
import { shapes } from '@dicebear/collection';

export function Header() {
  const { session, onSignOut } = useAuth();

  const avatar = createAvatar(shapes, {
    seed: session?.user.username,
  });

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Jovi's Bank</h2>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={avatar.toDataUri()} />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{session?.user.username}</p>
                    <p className="text-xs">{session?.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer group"
                  onClick={() => {
                    onSignOut();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4 group-hover:text-accent-foreground" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
