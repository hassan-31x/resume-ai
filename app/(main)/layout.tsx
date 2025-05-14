import React from 'react'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/app-sidebar'
import { Toaster } from '@/components/ui/toaster'

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen w-full bg-background'>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <div className="flex-1 overflow-auto bg-slate-50">
          <SidebarTrigger className="h-8 w-auto mx-4 mt-2" />
          {children}
        </div>
      </SidebarProvider>
      <Toaster />
    </div>
  )
}

export default MainLayout
