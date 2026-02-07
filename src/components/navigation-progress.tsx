"use client"

import { useEffect, useState } from "react"
import { useNavigation } from "@/contexts/navigation-context"

export function NavigationProgress() {
  const { navigatingTo } = useNavigation()
  const [state, setState] = useState<"idle" | "loading" | "completing">("idle")

  useEffect(() => {
    if (navigatingTo) {
      setState("loading")
    } else if (state === "loading") {
      // Route loaded — snap to 100% then fade out
      setState("completing")
      const timer = setTimeout(() => setState("idle"), 300)
      return () => clearTimeout(timer)
    }
  }, [navigatingTo]) // eslint-disable-line react-hooks/exhaustive-deps

  if (state === "idle") return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5">
      <div
        className={
          state === "loading"
            ? "h-full bg-primary animate-navigation-progress"
            : "h-full bg-primary w-full transition-opacity duration-300 opacity-0"
        }
      />
    </div>
  )
}
