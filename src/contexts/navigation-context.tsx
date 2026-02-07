"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"

interface NavigationContextType {
  navigatingTo: string | null
  startNavigation: (href: string) => void
}

const NavigationContext = createContext<NavigationContextType>({
  navigatingTo: null,
  startNavigation: () => {},
})

const SAFETY_TIMEOUT_MS = 10_000

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null)
  const pathname = usePathname()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startNavigation = useCallback((href: string) => {
    // Skip if already on this page
    if (href === pathname) return
    // Skip external links and hash links
    if (href.startsWith("http") || href.startsWith("#")) return

    setNavigatingTo(href)
  }, [pathname])

  // Clear navigation state when pathname changes (route loaded)
  useEffect(() => {
    setNavigatingTo(null)
  }, [pathname])

  // Safety timeout to clear stale navigation state
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (navigatingTo) {
      timeoutRef.current = setTimeout(() => {
        setNavigatingTo(null)
      }, SAFETY_TIMEOUT_MS)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [navigatingTo])

  return (
    <NavigationContext value={{ navigatingTo, startNavigation }}>
      {children}
    </NavigationContext>
  )
}

export function useNavigation() {
  return useContext(NavigationContext)
}
