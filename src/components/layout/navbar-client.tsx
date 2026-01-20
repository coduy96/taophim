"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon as Menu, ArrowRight01Icon as ArrowRight } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface MobileMenuProps {
  isLoggedIn?: boolean
}

// Only mount this component on client - handles mobile menu and scroll effects
export function NavbarClientEnhancements({ isLoggedIn = false }: MobileMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  // Scroll effect - enhance the static navbar
  React.useEffect(() => {
    const header = document.querySelector('[data-navbar]')
    if (!header) return

    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('bg-background/80', 'backdrop-blur-xl', 'border-border/50', 'shadow-sm')
        header.classList.remove('bg-transparent', 'border-transparent')
      } else {
        header.classList.remove('bg-background/80', 'backdrop-blur-xl', 'border-border/50', 'shadow-sm')
        header.classList.add('bg-transparent', 'border-transparent')
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Tính năng", href: "#features" },
    { name: "Dịch vụ", href: "#services" },
    { name: "Cách hoạt động", href: "#how-it-works" },
  ]

  const getHref = (href: string) => {
    if (href.startsWith("#")) {
      return isHome ? href : `/${href}`
    }
    return href
  }

  return (
    <div className="md:hidden flex items-center gap-2">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
            <HugeiconsIcon icon={Menu} className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] border-l-border/50 backdrop-blur-xl bg-background/95">
          <SheetHeader className="text-left mb-6">
            <SheetTitle className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <span className="font-bold">Taophim</span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={getHref(link.href)}
                  className="text-lg font-medium py-2 px-4 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-border/50 pt-6 flex flex-col gap-3">
              {isLoggedIn ? (
                <Button asChild size="lg" className="w-full rounded-full shadow-lg shadow-primary/20">
                  <Link href="/dashboard">
                    Vào Dashboard
                    <HugeiconsIcon icon={ArrowRight} className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="lg" className="w-full rounded-full" asChild>
                    <Link href="/login">Đăng nhập</Link>
                  </Button>
                  <Button size="lg" className="w-full rounded-full shadow-md" asChild>
                    <Link href="/register">
                      Đăng ký miễn phí
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
