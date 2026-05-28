'use client';

import Link from 'next/link';
import { LogOut, Menu, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AdminSessionUser } from '@/lib/auth/admin-session';

type AdminHeaderProps = {
  title: string;
  user: AdminSessionUser | null;
  onMenuClick: () => void;
  onLogout: () => void;
};

export function AdminHeader({ title, user, onMenuClick, onLogout }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/82 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button type="button" variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} aria-label="Open admin menu">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Admin</p>
          <h1 className="truncate text-lg font-semibold text-foreground sm:text-xl">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline">
          View site
        </Link>
        <div className="hidden items-center gap-2 rounded-md border border-border bg-secondary/35 px-3 py-2 md:flex">
          <UserCircle className="h-4 w-4 text-primary" />
          <span className="max-w-40 truncate text-sm text-muted-foreground">{user?.email ?? 'Admin'}</span>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
