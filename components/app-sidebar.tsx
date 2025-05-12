import React from 'react'
import Link from 'next/link'
import { 
  FileText, 
  Grid, 
  Home, 
  Settings, 
  User, 
  FileEdit,
  LogOut,
  CircleUser
} from 'lucide-react'

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ModeToggle } from '@/components/mode-toggle'

import { getCurrentUser } from '@/lib/user'

const AppSidebar = async () => {
  const user = await getCurrentUser()

  return (
    <Sidebar side="left" className="border-r">
      <SidebarHeader className="flex h-16 items-center justify-center border-b">
        <Link href="/dashboard" className="flex items-center gap-2 px-2 py-4">
          <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-xl font-semibold tracking-tight">Resume.AI</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="px-4 py-2">
            <h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
              Navigation
            </h2>
            <div className="space-y-1">
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/browse">
                <Button variant="ghost" className="w-full justify-start">
                  <Grid className="mr-2 h-4 w-4" />
                  Browse Templates
                </Button>
              </Link>
              <Link href="/editor">
                <Button variant="ghost" className="w-full justify-start">
                  <FileEdit className="mr-2 h-4 w-4" />
                  My Resumes
                </Button>
              </Link>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="px-4 py-2">
            <h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
              Account
            </h2>
            <div className="space-y-1">
              <Link href="/settings">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
              <Link href="/settings/profile">
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Link href="/api/auth/signout">
                <Button variant="ghost" className="w-full justify-start text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </Link>
            </div>
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t p-0">
        <div className="flex items-center justify-between p-4 bg-muted/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-2 border-primary/10">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback>
                <CircleUser className="h-5 w-5 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground mt-1 truncate max-w-[120px]">{user?.email || ""}</p>
            </div>
          </div>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
