'use client';

import Link from 'next/link';
import {
  BriefcaseBusiness,
  Gauge,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  UserRound,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const adminNavItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: Gauge },
  { label: 'Profile', href: '/admin/profile', icon: UserRound },
  { label: 'Projects', href: '/admin/projects', icon: BriefcaseBusiness },
  { label: 'Skills', href: '/admin/skills', icon: Wrench },
  { label: 'Experiences', href: '/admin/experiences', icon: Sparkles },
  { label: 'Messages', href: '/admin/messages', icon: Mail },
];

type AdminSidebarProps = {
  activePath: string;
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
};

export function AdminSidebar({ activePath, isOpen, onClose, onToggle }: AdminSidebarProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Close admin menu"
        className={cn(
          'fixed inset-0 z-[70] bg-background/70 backdrop-blur-sm transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-[80] flex w-72 flex-col border-r border-border bg-card/96 shadow-[0_22px_80px_hsl(222_36%_4%/0.38)] backdrop-blur-xl transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-sm font-semibold text-primary">
              HH
            </span>
            <span>
              <span className="block font-semibold text-foreground">Hari Admin</span>
              <span className="block text-xs text-muted-foreground">Portfolio CMS</span>
            </span>
          </Link>

          <button
            type="button"
            aria-label={isOpen ? 'Collapse sidebar' : 'Open sidebar'}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
            onClick={onToggle}
          >
            {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Admin navigation">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/12 text-primary shadow-[0_0_28px_hsl(var(--primary)/0.12)]'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <p className="text-xs leading-5 text-muted-foreground">
            Admin routes are protected locally by the stored JWT token. API calls should include the token for protected
            mutations in later CRUD slices.
          </p>
        </div>
      </aside>
    </>
  );
}
