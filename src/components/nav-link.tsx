"use client"

import Link from "next/link"
import { useNavigation } from "@/contexts/navigation-context"
import { ComponentProps, MouseEvent } from "react"

export function NavLink({ href, onClick, ...props }: ComponentProps<typeof Link>) {
  const { startNavigation } = useNavigation()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (typeof href === "string") {
      startNavigation(href)
    }
    if (typeof onClick === "function") {
      onClick(e)
    }
  }

  return <Link href={href} onClick={handleClick} {...props} />
}
