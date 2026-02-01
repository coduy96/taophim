import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Icons - inline SVG for performance
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const InfinityIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
  </svg>
)

const QrCodeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
)

interface XuPackage {
  slug: string
  label: string
  tagline: string
  base_xu: number
  bonus_xu: number
  total_xu: number
  price_vnd: number
  popular?: boolean
  features: string[]
}

const XU_PACKAGES: XuPackage[] = [
  {
    slug: "starter",
    label: "Dùng thử",
    tagline: "Tạo 1-2 video đầu tiên",
    base_xu: 150,
    bonus_xu: 0,
    total_xu: 150,
    price_vnd: 150000,
    features: [
      "Tạo 1-2 video AI",
      "Hỗ trợ qua Messenger",
      "Xu không hết hạn",
    ]
  },
  {
    slug: "popular",
    label: "Tiết kiệm",
    tagline: "Được chọn nhiều nhất",
    base_xu: 500,
    bonus_xu: 50,
    total_xu: 550,
    price_vnd: 500000,
    popular: true,
    features: [
      "Tạo 5-10 video AI",
      "🎁 Bonus 50 Xu miễn phí",
      "Hỗ trợ ưu tiên",
      "Xu không hết hạn",
    ]
  },
  {
    slug: "pro",
    label: "Pro",
    tagline: "Dành cho creator chuyên nghiệp",
    base_xu: 1500,
    bonus_xu: 300,
    total_xu: 1800,
    price_vnd: 1500000,
    features: [
      "Tạo 15-30 video AI",
      "🎁 Bonus 300 Xu miễn phí",
      "Hỗ trợ VIP 1-1",
      "Xu không hết hạn",
      "Giá tốt nhất/video",
    ]
  },
]

export function PricingSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section id="pricing" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            Xu bảo lưu vĩnh viễn
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Nạp Xu <span className="text-primary">Theo Nhu Cầu</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Không cần subscription hàng tháng. Nạp bao nhiêu dùng bấy nhiêu.
            <br />
            <span className="text-foreground font-medium">Xu mua 1 lần, dùng vĩnh viễn.</span>
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {XU_PACKAGES.map((pkg) => (
            <div
              key={pkg.slug}
              className={cn(
                "relative flex flex-col rounded-2xl border-2 bg-background p-6 lg:p-8 transition-all duration-300",
                "hover:shadow-lg hover:-translate-y-1",
                pkg.popular
                  ? "border-primary shadow-xl shadow-primary/10 scale-[1.02] md:scale-105"
                  : "border-border/50 hover:border-primary/50"
              )}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 text-sm font-bold text-white rounded-full bg-gradient-to-r from-orange-500 to-primary shadow-lg whitespace-nowrap">
                    🔥 Phổ biến nhất
                  </span>
                </div>
              )}

              {/* Package Header */}
              <div className={cn("text-center", pkg.popular && "mt-2")}>
                <h3 className="text-lg font-bold mb-1">{pkg.label}</h3>
                <p className="text-sm text-muted-foreground mb-6">{pkg.tagline}</p>
              </div>

              {/* Xu Amount - Hero */}
              <div className="text-center mb-2">
                <div className="inline-flex items-baseline gap-1">
                  <span className={cn(
                    "text-5xl lg:text-6xl font-bold tracking-tight",
                    pkg.popular ? "text-primary" : "text-foreground"
                  )}>
                    {pkg.total_xu.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-2xl font-semibold text-muted-foreground">Xu</span>
                </div>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <span className="text-lg text-muted-foreground">
                  {pkg.price_vnd.toLocaleString('vi-VN')}đ
                </span>
                {pkg.bonus_xu > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30 rounded-full">
                    +{pkg.bonus_xu} bonus
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                size="lg"
                variant={pkg.popular ? "default" : "outline"}
                className={cn(
                  "w-full h-12 rounded-xl text-base font-semibold transition-all",
                  pkg.popular && "shadow-lg shadow-primary/25 hover:shadow-primary/40"
                )}
                asChild
              >
                <Link href={isLoggedIn ? "/dashboard/wallet" : "/register"}>
                  {isLoggedIn ? "Nạp ngay" : "Đăng ký & Nạp Xu"}
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Trust Signals */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <ShieldIcon className="h-4 w-4 text-green-600" />
              Bảo mật 100%
            </span>
            <span className="flex items-center gap-2">
              <InfinityIcon className="h-4 w-4 text-primary" />
              Xu không hết hạn
            </span>
            <span className="flex items-center gap-2">
              <QrCodeIcon className="h-4 w-4 text-blue-600" />
              Thanh toán QR ngân hàng
            </span>
          </div>
          <p className="text-xs text-muted-foreground/70 text-center max-w-md">
            Thanh toán qua QR Code, VNPAY, MoMo, hoặc chuyển khoản ngân hàng. Xu cộng ngay sau khi thanh toán thành công.
          </p>
        </div>
      </div>
    </section>
  )
}
