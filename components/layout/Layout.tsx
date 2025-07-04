'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { LoadingPage } from '@/components/ui/loading-page';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage message="Cargando aplicación..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};