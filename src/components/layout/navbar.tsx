import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { NavbarClientEnhancements } from "./navbar-client"

// Inline SVG for ArrowRight - avoids hugeicons bundle for server render
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

interface NavbarProps {
  isLoggedIn?: boolean
}

// Server-rendered navbar shell - no "use client" directive
// Client enhancements (scroll effect, mobile menu, active section) are loaded separately
export function Navbar({ isLoggedIn = false }: NavbarProps) {
  return (
    <header
      data-navbar
      className="sticky top-0 z-50 w-full transition-all duration-300 border-b bg-transparent border-transparent"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Logo className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" priority />
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Taophim
          </span>
        </Link>

        {/* Desktop Nav + Mobile Menu - Client component handles both with active state */}
        <NavbarClientEnhancements isLoggedIn={isLoggedIn} />

        {/* Desktop Actions - Server rendered */}
        <div className="hidden md:flex items-center gap-3">
          {/* Blog Link */}
          <Button
            variant="ghost"
            asChild
            className="hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Link href="/blog">Blog</Link>
          </Button>

          {isLoggedIn ? (
            <Button
              asChild
              className="rounded-full px-6 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              <Link href="/dashboard">
                Vào Dashboard
                <ArrowRightIcon />
              </Link>
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className="hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button
                asChild
                className="rounded-full px-6 shadow-md hover:shadow-lg transition-all"
              >
                <Link href="/register">
                  Đăng ký miễn phí
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
