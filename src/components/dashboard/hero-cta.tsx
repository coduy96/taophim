"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon as ArrowRight } from "@hugeicons/core-free-icons"

export function HeroCTA() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 p-8 md:p-10">
      {/* Animated gradient orbs */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-slow [animation-delay:3s]" />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-white opacity-[0.02]" />

      {/* Shimmer effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
        <div className="space-y-3 text-center lg:text-left">
          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Biến ý tưởng thành{" "}
            <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent animate-gradient-x">
              video triệu view
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-zinc-400 text-sm sm:text-base lg:text-lg leading-relaxed">
            Không cần kỹ năng. Không cần đợi lâu. Chỉ cần ý tưởng của bạn.
          </p>

          {/* Price highlight */}
          <div className="flex items-center justify-center lg:justify-start gap-3 pt-1">
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-zinc-500 line-through">5.000đ</span>
              <span className="text-2xl sm:text-3xl font-bold text-white">1.000đ</span>
              <span className="text-zinc-500">/Xu</span>
            </div>
            <div className="h-5 w-px bg-zinc-700" />
            <span className="text-sm text-emerald-400 font-medium">Tiết kiệm 80%</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center lg:items-end shrink-0">
          <Button
            asChild
            size="lg"
            className="group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12 sm:h-14 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
          >
            <Link href="/dashboard/wallet">
              <span className="flex items-center">
                Bắt đầu tạo video
                <HugeiconsIcon
                  icon={ArrowRight}
                  className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </Link>
          </Button>
          <p className="text-xs text-zinc-500 mt-2">
            ✓ QR • VNPAY • Chuyển khoản
          </p>
        </div>
      </div>
    </div>
  )
}
