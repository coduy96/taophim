import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PlayIcon as Play,
  ArrowRight01Icon as ArrowRight,
  StarIcon as Star,
  Film01Icon as Film,
  Coins01Icon as Coins,
  MagicWand01Icon as Wand2,
  Time01Icon as Clock,
  FlashIcon as Zap,
} from "@hugeicons/core-free-icons"
import { unstable_noStore as noStore } from "next/cache"

function formatNumber(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

function formatVND(xu: number): string {
  return new Intl.NumberFormat('vi-VN').format(xu * 1000)
}

interface Service {
  id: string
  slug: string
  name: string
  description: string | null
  cost_per_second: number
  cover_image: string | null
}

// Example video durations for price estimation
const EXAMPLE_DURATIONS = [5, 10] // seconds

export async function ServicesSection({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  // Disable caching to ensure fresh data on each request
  noStore()

  const supabase = await createClient()

  // Fetch active services that are marked to show on landing page
  const { data: services } = await supabase
    .from('services')
    .select('id, slug, name, description, cost_per_second, cover_image')
    .is('deleted_at', null)
    .eq('is_active', true)
    .eq('is_public_on_landing', true)
    .limit(6)

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <HugeiconsIcon icon={Wand2} className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Đang cập nhật dịch vụ</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Chúng tôi đang nỗ lực bổ sung các dịch vụ mới nhất. Vui lòng quay lại sau!
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service: Service, index: number) => {
        const exampleCost5s = service.cost_per_second * 5
        const exampleCost10s = service.cost_per_second * 10

        return (
          <Link
            href={isLoggedIn ? `/dashboard/services/${service.slug}` : "/register"}
            key={service.id}
            className="group relative flex flex-col h-full bg-background border border-border/60 rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
          >
            {/* Hot Badge for first item */}
            {index === 0 && (
              <div className="absolute top-4 left-4 z-30">
                <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
                  <HugeiconsIcon icon={Zap} className="w-3 h-3" />
                  HOT
                </div>
              </div>
            )}

            {/* Image/Preview Area */}
            <div className="aspect-[16/10] relative overflow-hidden bg-muted">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

              {/* Image */}
              {service.cover_image ? (
                <Image
                  src={service.cover_image}
                  alt={`Dịch vụ ${service.name} - Tạo video AI chất lượng 4K`}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                  <HugeiconsIcon icon={Film} className="w-12 h-12 text-primary/20" />
                </div>
              )}

              {/* Play Button Overlay (Hover) */}
              <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                <div className="w-14 h-14 rounded-full bg-white/95 text-primary flex items-center justify-center shadow-2xl backdrop-blur-sm">
                  <HugeiconsIcon icon={Play} className="w-6 h-6 ml-1 fill-current" />
                </div>
              </div>

              {/* Bottom Price Overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white">
                    <HugeiconsIcon icon={Clock} className="w-4 h-4 text-white/80" />
                    <span className="text-sm font-medium">{formatNumber(service.cost_per_second)} Xu/giây</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/90 text-xs">
                    <HugeiconsIcon icon={Star} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">4.9</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-grow p-5">
              <div className="flex-grow space-y-3">
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
                  {service.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description || "Tạo video chất lượng 4K với công nghệ AI tiên tiến nhất."}
                </p>
              </div>

              {/* VND Price Estimation */}
              <div className="mt-4 p-3 bg-muted/50 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <HugeiconsIcon icon={Coins} className="w-4 h-4 text-yellow-500" />
                  <span>Giá ước tính (1 Xu = 1.000đ)</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col items-center p-2 bg-background rounded-lg border border-border/50">
                    <span className="text-sm text-muted-foreground">Video 5 giây</span>
                    <span className="text-base text-foreground">{formatVND(exampleCost5s)} <strong className="font-bold">VNĐ</strong></span>
                    <span className="text-xs text-muted-foreground">({formatNumber(exampleCost5s)} Xu)</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-background rounded-lg border border-border/50">
                    <span className="text-sm text-muted-foreground">Video 10 giây</span>
                    <span className="text-base text-foreground">{formatVND(exampleCost10s)} <strong className="font-bold">VNĐ</strong></span>
                    <span className="text-xs text-muted-foreground">({formatNumber(exampleCost10s)} Xu)</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary flex items-center gap-1.5 group-hover:gap-2 transition-all">
                    Đặt Đơn Ngay
                    <HugeiconsIcon icon={ArrowRight} className="w-4 h-4" />
                  </span>
                  <span className="text-sm text-muted-foreground">Nhận video trong vài phút</span>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
