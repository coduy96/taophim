"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingBag01Icon as ShoppingBag,
  Wallet01Icon as Wallet,
  Time02Icon as History,
  Logout01Icon as LogOut,
  Film01Icon as Film,
  ArrowUp01Icon as ChevronUp,
  Home01Icon as Home,
  Settings01Icon as Settings,
} from "@hugeicons/core-free-icons"
import { logout } from "@/app/(auth)/actions"
import { useProfile } from "@/hooks/use-profile"
import { cn } from "@/lib/utils"

// Menu items configuration
const mainNavItems = [
  {
    title: "Tổng quan",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Tạo phim",
    href: "/dashboard/services",
    icon: Film,
  },
  {
    title: "Đơn hàng",
    href: "/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    title: "Ví Xu",
    href: "/dashboard/wallet",
    icon: Wallet,
  },
]

function formatXu(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { profile, isLoading } = useProfile()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Logo className="size-5 fill-current" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Taophim</span>
                  <span className="truncate text-xs text-muted-foreground">AI Video SaaS</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Nền tảng</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <HugeiconsIcon icon={item.icon} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Minimal Wallet Card */}
        <div className="px-2 py-2">
          <div className={cn(
            "relative overflow-hidden rounded-xl border bg-background p-4 shadow-sm transition-all hover:shadow-md",
            "group-data-[collapsible=icon]:hidden" // Hide when collapsed
          )}>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <HugeiconsIcon icon={Wallet} className="size-3.5" />
              <span>Số dư khả dụng</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-xl font-bold tracking-tight text-foreground">
                {isLoading ? "..." : formatXu(profile?.xu_balance || 0)}
              </span>
              <span className="text-xs font-medium text-muted-foreground">Xu</span>
            </div>

            {profile && profile.frozen_xu > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-md w-fit">
                <div className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                Đang giữ: {formatXu(profile.frozen_xu)}
              </div>
            )}

            {/* Decorative background element */}
            <div className="absolute -right-4 -top-4 size-16 rounded-full bg-primary/5 blur-2xl" />
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                    <AvatarFallback className="rounded-lg">
                      {profile?.full_name?.charAt(0).toUpperCase() || profile?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{profile?.full_name || "Người dùng"}</span>
                    <span className="truncate text-xs text-muted-foreground">{profile?.email}</span>
                  </div>
                  <HugeiconsIcon icon={ChevronUp} className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                      <AvatarFallback className="rounded-lg">
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
                  <Link href="/dashboard/wallet">
                    <HugeiconsIcon icon={History} className="mr-2 h-4 w-4" />
                    Lịch sử giao dịch
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <HugeiconsIcon icon={Settings} className="mr-2 h-4 w-4" />
                    Cài đặt
                  </Link>
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
