import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PlayIcon as Play,
  ArrowRight01Icon as ArrowRight,
  StarIcon as Star,
  Film01Icon as Film,
  Coins01Icon as Coins,
  MagicWand01Icon as Wand2,
} from "@hugeicons/core-free-icons"
import { unstable_noStore as noStore } from "next/cache"

function formatXu(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

interface Service {
  id: string
  slug: string
  name: string
  description: string | null
  cost_per_second: number
  cover_image: string | null
}

export async function ServicesSection({ user }: { user: any }) {
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
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service: Service) => (
        <Link
          href={user ? `/dashboard/services/${service.slug}` : "/register"}
          key={service.id}
          className="group relative flex flex-col h-full bg-background border border-border/50 rounded-3xl overflow-hidden"
        >
          {/* Image/Preview Area */}
          <div className="aspect-[16/10] relative overflow-hidden bg-muted">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />

            {/* Image */}
            {service.cover_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={service.cover_image}
                alt={service.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                <HugeiconsIcon icon={Film} className="w-12 h-12 text-primary/20" />
              </div>
            )}

            {/* Floating Price Tag */}
            <div className="absolute top-4 right-4 z-20">
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                <HugeiconsIcon icon={Coins} className="w-3.5 h-3.5 text-yellow-400" />
                <span>{formatXu(service.cost_per_second)} Xu/giây</span>
              </div>
            </div>

            {/* Play Button Overlay (Hover) */}
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
              <div className="w-14 h-14 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 backdrop-blur-sm">
                <HugeiconsIcon icon={Play} className="w-6 h-6 ml-1 fill-current" />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-col flex-grow p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                {service.name}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                {service.description || "Tạo video chất lượng 4K với công nghệ AI tiên tiến nhất. Gửi ảnh, nhận video trong vài giờ."}
              </p>
            </div>

            <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
              <span className="text-sm font-medium text-primary flex items-center gap-1 group/btn">
                Đặt Đơn Ngay
                <HugeiconsIcon icon={ArrowRight} className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <HugeiconsIcon icon={Star} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span>4.9/5.0</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
