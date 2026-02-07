"use client"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationBell } from "@/components/notification-bell"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Settings01Icon as Settings,
  Logout01Icon as LogOut,
  CustomerService01Icon as Support,
} from "@hugeicons/core-free-icons"
import { logout } from "@/app/(auth)/actions"
import { usePathname } from "next/navigation"
import Link from "next/link"
import React from "react"

import { Profile } from "@/types/database.types"
import { User } from "@supabase/supabase-js"

export default function DashboardLayout({
  children,
  user,
  profile
}: {
  children: React.ReactNode
  user: User | null
  profile: Profile | null
}) {
  const pathname = usePathname()
  
  // Simple breadcrumb logic
  const segments = pathname.split('/').filter(Boolean)
  const isDashboardRoot = segments.length === 1 && segments[0] === 'dashboard'

  return (
    <SidebarProvider>
      <AppSidebar user={user} profile={profile} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 hidden md:flex" />
            {/* Mobile: profile avatar dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="-ml-1 flex items-center justify-center md:hidden">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                    <AvatarFallback className="rounded-full text-xs">
                      {profile?.full_name?.charAt(0).toUpperCase() || profile?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={8} className="w-56 rounded-lg">
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-full">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                      <AvatarFallback className="rounded-full text-xs">
                        {profile?.full_name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{profile?.full_name || "Người dùng"}</span>
                      <span className="truncate text-xs text-muted-foreground">{profile?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <HugeiconsIcon icon={Settings} className="mr-2 h-4 w-4" />
                    Cài đặt
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="https://m.me/61573590554545" target="_blank" rel="noopener noreferrer">
                    <HugeiconsIcon icon={Support} className="mr-2 h-4 w-4" />
                    Liên hệ hỗ trợ
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => logout()}
                >
                  <HugeiconsIcon icon={LogOut} className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Tổng quan</BreadcrumbLink>
                </BreadcrumbItem>
                {!isDashboardRoot && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="capitalize">
                        {segments[segments.length - 1] === 'services' ? 'Tạo phim' :
                         segments[segments.length - 1] === 'orders' ? 'Đơn hàng' :
                         segments[segments.length - 1] === 'wallet' ? 'Ví Xu' :
                         segments[segments.length - 1]}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 px-4">
            <NotificationBell />
          </div>
        </header>
        <main className="flex-1 p-4 pt-0 pb-20 md:p-6 md:pt-0 md:pb-6">
          <div className="mt-4 md:mt-6">
             {children}
          </div>
        </main>
      </SidebarInset>
      <BottomNav />
    </SidebarProvider>
  )
}
