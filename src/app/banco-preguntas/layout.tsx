import React from 'react';
import NavBar from '@/components/NavBar';

export default function BancoPreguntasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center">
      <NavBar />
      {children}
    </div>
  );
} 