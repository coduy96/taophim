"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Check icon
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// X icon
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// Compare icon
const CompareIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

interface ComparisonRow {
  feature: string
  taophim: string | boolean
  premium: string | boolean
  highlight?: boolean
}

const comparisonData: ComparisonRow[] = [
  {
    feature: "Chi phí hàng tháng",
    taophim: "Chỉ trả khi dùng",
    premium: "$30-$90/tháng (~750k-2.3tr VNĐ)",
    highlight: true
  },
  {
    feature: "Thanh toán QR Việt Nam",
    taophim: true,
    premium: false
  },
  {
    feature: "Yêu cầu thẻ Visa/Mastercard",
    taophim: false,
    premium: true
  },
  {
    feature: "Credits hết hạn cuối tháng",
    taophim: false,
    premium: true
  },
  {
    feature: "Xu/Credits bảo lưu vĩnh viễn",
    taophim: true,
    premium: false
  },
  {
    feature: "Hỗ trợ tiếng Việt 24/7",
    taophim: true,
    premium: false
  },
  {
    feature: "Cam kết hoàn tiền",
    taophim: true,
    premium: false
  },
  {
    feature: "Chất lượng video AI",
    taophim: "Cao nhất (4K)",
    premium: "Cao nhất (4K)"
  },
  {
    feature: "Không cần học sử dụng phức tạp",
    taophim: true,
    premium: false
  },
  {
    feature: "Ước tính chi phí cho 10 video/tháng",
    taophim: "~90.000đ - 500.000đ",
    premium: "750.000đ - 2.300.000đ",
    highlight: true
  }
]

function ComparisonCell({ value, isTaophim }: { value: string | boolean; isTaophim: boolean }) {
  if (typeof value === "boolean") {
    if (isTaophim) {
      return value ? (
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
            <XIcon className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      )
    } else {
      return value ? (
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <CheckIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <XIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
        </div>
      )
    }
  }

  return (
    <span className={cn(
      "text-sm",
      isTaophim ? "font-semibold text-primary" : "text-muted-foreground"
    )}>
      {value}
    </span>
  )
}

export function ComparisonSection() {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <CompareIcon className="w-4 h-4" />
            So sánh chi tiết
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Taophim vs. <span className="text-primary">Mua Tài Khoản Premium</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tại sao hàng nghìn người Việt chọn Taophim thay vì mua subscription Runway, Pika, hay Kling?
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border/50 bg-background overflow-hidden shadow-xl shadow-primary/5">
            {/* Table Header */}
            <div className="grid grid-cols-2 sm:grid-cols-3 border-b border-border/50">
              <div className="hidden sm:block p-4 md:p-6 bg-muted/30">
                <span className="text-sm font-medium text-muted-foreground">Tính năng</span>
              </div>
              <div className="p-4 md:p-6 text-center bg-primary/5 border-r sm:border-x border-primary/20">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-base sm:text-lg font-bold text-primary">Taophim</span>
                  <span className="text-xs text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full">Khuyến nghị</span>
                </div>
              </div>
              <div className="p-4 md:p-6 text-center bg-muted/30">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-base sm:text-lg font-bold text-muted-foreground">Premium</span>
                  <span className="text-xs text-muted-foreground">Runway, Pika...</span>
                </div>
              </div>
            </div>

            {/* Table Body */}
            {comparisonData.map((row, index) => (
              <div
                key={index}
                className={cn(
                  "border-b border-border/50 last:border-b-0",
                  row.highlight && "bg-primary/5"
                )}
              >
                {/* Feature name - full width on mobile, inline on sm+ */}
                <div className="sm:hidden px-4 pt-3 pb-1">
                  <span className={cn(
                    "text-xs font-medium",
                    row.highlight ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {row.feature}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3">
                  <div className="hidden sm:flex p-4 md:p-5 items-center">
                    <span className={cn(
                      "text-sm",
                      row.highlight ? "font-semibold text-foreground" : "text-foreground/80"
                    )}>
                      {row.feature}
                    </span>
                  </div>
                  <div className="p-3 sm:p-4 md:p-5 flex items-center justify-center border-r sm:border-x border-primary/10 bg-primary/[0.02]">
                    <ComparisonCell value={row.taophim} isTaophim={true} />
                  </div>
                  <div className="p-3 sm:p-4 md:p-5 flex items-center justify-center">
                    <ComparisonCell value={row.premium} isTaophim={false} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom summary */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">
                  Tiết kiệm đến <span className="text-primary">90%</span> chi phí
                </h3>
                <p className="text-muted-foreground text-sm">
                  Không subscription, không thẻ quốc tế, không credits hết hạn. Chỉ trả tiền cho video bạn thực sự tạo.
                </p>
              </div>
              <Button size="lg" className="rounded-full px-8 h-12 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 whitespace-nowrap" asChild>
                <Link href="/register">
                  Bắt Đầu Ngay
                  <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
