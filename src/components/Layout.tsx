import { type ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)] overflow-x-hidden">
      <Nav />
      <main className="pt-16 animate-page-in" key={pathname}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
