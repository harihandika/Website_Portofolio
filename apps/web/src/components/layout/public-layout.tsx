import * as React from 'react';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';

type PublicLayoutProps = {
  children: React.ReactNode;
};

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-clip">
      <a href="#main-content" className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform focus:translate-y-0">Skip to content</a>
      <Navbar />
      <main id="main-content" className="min-h-screen pt-20" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
