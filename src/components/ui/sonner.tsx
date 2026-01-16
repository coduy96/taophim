"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon as CircleCheckIcon,
  InformationCircleIcon as InfoIcon,
  Alert02Icon as TriangleAlertIcon,
  CancelCircleIcon as OctagonXIcon,
  Loading03Icon as Loader2Icon
} from "@hugeicons/core-free-icons"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: (
          <HugeiconsIcon icon={CircleCheckIcon} className="size-4" />
        ),
        info: (
          <HugeiconsIcon icon={InfoIcon} className="size-4" />
        ),
        warning: (
          <HugeiconsIcon icon={TriangleAlertIcon} className="size-4" />
        ),
        error: (
          <HugeiconsIcon icon={OctagonXIcon} className="size-4" />
        ),
        loading: (
          <HugeiconsIcon icon={Loader2Icon} className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
