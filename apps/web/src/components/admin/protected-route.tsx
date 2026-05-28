'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getAdminToken } from '@/lib/auth/admin-session';

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const token = getAdminToken();

    if (!token) {
      window.location.replace('/admin/login');
      return;
    }

    setIsAllowed(true);
    setIsChecking(false);
  }, []);

  if (isChecking || !isAllowed) {
    return (
      <div className="fixed inset-0 z-[60] flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-lg border border-border bg-card/90 p-8 text-center shadow-[0_22px_80px_hsl(222_36%_4%/0.36)]">
          <Loader2 className="mx-auto mb-4 h-6 w-6 animate-spin text-primary" />
          <p className="font-medium text-foreground">Checking admin session</p>
          <p className="mt-2 text-sm text-muted-foreground">Redirecting to login if access is missing.</p>
        </div>
      </div>
    );
  }

  return children;
}
