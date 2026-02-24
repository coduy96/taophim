"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon as SearchIcon } from "@hugeicons/core-free-icons"

export function UsersSearchInput({ initialValue }: { initialValue?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(initialValue ?? "")

  // Debounce navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) {
        params.set("search", value.trim())
      } else {
        params.delete("search")
      }
      // Reset to page 1 on new search
      params.delete("page")
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    }, 300)

    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }, [])

  return (
    <div className="relative">
      <HugeiconsIcon
        icon={SearchIcon}
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
      />
      <Input
        type="search"
        placeholder="Tìm theo tên hoặc email..."
        value={value}
        onChange={handleChange}
        className="pl-9 w-72"
      />
    </div>
  )
}
