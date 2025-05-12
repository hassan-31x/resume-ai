import React from 'react'
import { Toaster } from '@/components/ui/toaster'

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  )
} 