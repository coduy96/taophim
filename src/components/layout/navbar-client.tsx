"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon as Menu, ArrowRight01Icon as ArrowRight } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"
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

const navLinks = [
  { name: "Tính năng", href: "#features" },
  { name: "Dịch vụ", href: "#services" },
  { name: "Cách hoạt động", href: "#how-it-works" },
  { name: "Đánh giá", href: "#testimonials" },
  { name: "Bảng giá", href: "#pricing" },
  { name: "Hỏi đáp", href: "#faq" },
]

// Only mount this component on client - handles mobile menu, scroll effects, and active section
export function NavbarClientEnhancements({ isLoggedIn = false }: MobileMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState<string>("")
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

  // Active section tracking with IntersectionObserver
  React.useEffect(() => {
    if (!isHome) return

    const sectionIds = navLinks.map(link => link.href.replace('#', ''))
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (sections.length === 0) return

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Trigger when section is in middle-upper viewport
      threshold: 0
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    sections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [isHome])

  // Smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return

    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      e.preventDefault()

      const headerOffset = 80 // Account for fixed header
      const elementRect = targetElement.getBoundingClientRect()
      const elementHeight = targetElement.offsetHeight
      const viewportHeight = window.innerHeight

      // Calculate position to center the element in viewport
      // For tall sections, scroll to show the top with header offset
      // For shorter sections, center them in the viewport
      let offsetPosition: number
      if (elementHeight > viewportHeight - headerOffset) {
        // Section is taller than viewport, scroll to top
        offsetPosition = elementRect.top + window.scrollY - headerOffset
      } else {
        // Center the section in the viewport (accounting for header)
        const availableHeight = viewportHeight - headerOffset
        const centerOffset = (availableHeight - elementHeight) / 2
        offsetPosition = elementRect.top + window.scrollY - headerOffset - centerOffset
      }

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      // Update URL without reload
      window.history.pushState(null, '', href)
      setActiveSection(href)
    }
  }

  const getHref = (href: string) => {
    if (href.startsWith("#")) {
      return isHome ? href : `/${href}`
    }
    return href
  }

  return (
    <>
      {/* Desktop Navigation Links - Active state highlighting */}
      <nav className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={getHref(link.href)}
            onClick={(e) => isHome && handleNavClick(e, link.href)}
            className={cn(
              "text-sm font-medium px-4 py-2 rounded-full transition-all duration-300",
              activeSection === link.href
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu */}
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
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={getHref(link.href)}
                    className={cn(
                      "text-lg font-medium py-3 px-4 rounded-xl transition-all duration-300",
                      activeSection === link.href
                        ? "text-primary bg-primary/10"
                        : "hover:bg-muted"
                    )}
                    onClick={(e) => {
                      if (isHome && link.href.startsWith('#')) {
                        handleNavClick(e, link.href)
                      }
                      setIsMobileMenuOpen(false)
                    }}
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
    </>
  )
}
