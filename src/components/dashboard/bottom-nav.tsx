"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon as Home,
  Film01Icon as Film,
  ShoppingBag01Icon as ShoppingBag,
  Wallet01Icon as Wallet,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Tổng quan", icon: Home, exact: true },
  { href: "/dashboard/services", label: "Tạo phim", icon: Film, exact: false },
  { href: "/dashboard/orders", label: "Đơn hàng", icon: ShoppingBag, exact: false },
  { href: "/dashboard/wallet", label: "Ví Xu", icon: Wallet, exact: false },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-xl md:hidden">
      <div className="flex h-16 items-center pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <HugeiconsIcon
                icon={item.icon}
                className="h-5 w-5"
              />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
