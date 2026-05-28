'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar, adminNavItems } from '@/components/admin/admin-sidebar';
import { ProtectedRoute } from '@/components/admin/protected-route';
import { clearAdminSession, getAdminUser, type AdminSessionUser } from '@/lib/auth/admin-session';

type AdminLayoutProps = {
  children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState('/admin/dashboard');
  const [user, setUser] = useState<AdminSessionUser | null>(null);

  useEffect(() => {
    setActivePath(window.location.pathname);
    setUser(getAdminUser());
  }, []);

  const title = useMemo(() => {
    return adminNavItems.find((item) => item.href === activePath)?.label ?? 'Admin';
  }, [activePath]);

  function handleLogout() {
    clearAdminSession();
    window.location.replace('/admin/login');
  }

  return (
    <ProtectedRoute>
      <div className="fixed inset-0 z-[60] flex overflow-hidden bg-background text-foreground">
        <AdminSidebar
          activePath={activePath}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onToggle={() => setIsSidebarOpen((current) => !current)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader
            title={title}
            user={user}
            onMenuClick={() => setIsSidebarOpen(true)}
            onLogout={handleLogout}
          />
          <main className="flex-1 overflow-y-auto bg-[linear-gradient(135deg,hsl(var(--background)),hsl(215_26%_10%))]">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
