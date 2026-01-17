"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon as ChevronLeft,
  ArrowRight01Icon as ChevronRight,
  MoreHorizontalIcon as MoreHorizontal,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  /** URL search param name for page number */
  pageParamName?: string
  /** Additional search params to preserve when navigating */
  preserveParams?: string[]
  className?: string
}

function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  pageParamName = "page",
  preserveParams = [],
  className,
}: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Don't show pagination if there's only one page or less
  if (totalPages <= 1) return null

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()
    
    // Preserve specified params
    preserveParams.forEach(param => {
      const value = searchParams.get(param)
      if (value) params.set(param, value)
    })
    
    // Set the page param
    if (page > 1) {
      params.set(pageParamName, page.toString())
    }
    
    const queryString = params.toString()
    return queryString ? `${pathname}?${queryString}` : pathname
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push("ellipsis")
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis")
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pages = getPageNumbers()
  const hasPrevious = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <nav
      role="navigation"
      aria-label="Phân trang"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon-sm"
        className={cn(
          "rounded-lg",
          !hasPrevious && "pointer-events-none opacity-50"
        )}
        asChild={hasPrevious}
        disabled={!hasPrevious}
      >
        {hasPrevious ? (
          <Link href={createPageUrl(currentPage - 1)} aria-label="Trang trước">
            <HugeiconsIcon icon={ChevronLeft} className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            <HugeiconsIcon icon={ChevronLeft} className="h-4 w-4" />
          </span>
        )}
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-8 w-8 items-center justify-center text-muted-foreground"
            >
              <HugeiconsIcon icon={MoreHorizontal} className="h-4 w-4" />
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon-sm"
              className={cn(
                "rounded-lg min-w-8 h-8",
                currentPage === page && "pointer-events-none"
              )}
              asChild={currentPage !== page}
            >
              {currentPage === page ? (
                <span>{page}</span>
              ) : (
                <Link href={createPageUrl(page)} aria-label={`Trang ${page}`}>
                  {page}
                </Link>
              )}
            </Button>
          )
        )}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon-sm"
        className={cn(
          "rounded-lg",
          !hasNext && "pointer-events-none opacity-50"
        )}
        asChild={hasNext}
        disabled={!hasNext}
      >
        {hasNext ? (
          <Link href={createPageUrl(currentPage + 1)} aria-label="Trang sau">
            <HugeiconsIcon icon={ChevronRight} className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            <HugeiconsIcon icon={ChevronRight} className="h-4 w-4" />
          </span>
        )}
      </Button>
    </nav>
  )
}

interface PaginationInfoProps {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  className?: string
}

function PaginationInfo({
  currentPage,
  itemsPerPage,
  totalItems,
  className,
}: PaginationInfoProps) {
  const start = (currentPage - 1) * itemsPerPage + 1
  const end = Math.min(currentPage * itemsPerPage, totalItems)

  if (totalItems === 0) return null

  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      Hiển thị <span className="font-medium text-foreground">{start}</span> -{" "}
      <span className="font-medium text-foreground">{end}</span> trong{" "}
      <span className="font-medium text-foreground">{totalItems}</span> kết quả
    </p>
  )
}

export { Pagination, PaginationInfo }
