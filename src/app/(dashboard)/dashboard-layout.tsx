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
import { usePathname } from "next/navigation"
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
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
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
        </header>
        <main className="flex-1 p-4 pt-0 md:p-6 md:pt-0">
          <div className="mt-4 md:mt-6">
             {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
