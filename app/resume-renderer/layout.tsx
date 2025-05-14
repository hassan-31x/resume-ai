import React from 'react';
import { Toaster } from '@/components/ui/toaster';

export default function ResumeRendererLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
} 