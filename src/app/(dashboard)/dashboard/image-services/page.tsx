import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { NavLink } from "@/components/nav-link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SparklesIcon as Sparkles,
  ArrowRight01Icon as ArrowRight,
  Coins01Icon as Coins,
  Image01Icon as ImageIcon,
} from "@hugeicons/core-free-icons"
import Image from "next/image"
import { Pagination, PaginationInfo } from "@/components/ui/pagination"
import { ServiceSearchInput } from "@/components/service-search-input"

const ITEMS_PER_PAGE = 9

function formatXu(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

interface Service {
  id: string
  slug: string
  name: string
  description: string | null
  cost_per_second: number
  is_active: boolean
  cover_image: string | null
}

export default async function ImageServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const { page, search } = await searchParams
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1)
  const supabase = await createClient()

  const [userResult, servicesResult] = await Promise.all([
    supabase.auth.getUser(),
    (async () => {
      const offset = (currentPage - 1) * ITEMS_PER_PAGE

      let query = supabase
        .from('services')
        .select('*', { count: 'exact' })
        .is('deleted_at', null)
        .eq('is_active', true)
        .eq('service_type', 'image')

      if (search?.trim()) {
        query = query.or(`name.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`)
      }

      return query
        .order('created_at', { ascending: true })
        .range(offset, offset + ITEMS_PER_PAGE - 1)
    })()
  ])

  const { data: { user } } = userResult
  if (!user) redirect('/login')

  const { data: services, count: totalCount } = servicesResult
  const totalItems = totalCount || 0
  const validPage = currentPage

  return (
    <div className="max-w-6xl mx-auto space-y-5 md:space-y-8 pb-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Dịch vụ tạo Ảnh AI</h1>
          <p className="text-muted-foreground text-sm md:text-base mt-0.5 md:mt-1">
            Khám phá các công cụ tạo ảnh AI mạnh mẽ.
          </p>
        </div>

        <div className="hidden md:block">
          <ServiceSearchInput initialValue={search} />
        </div>
      </div>

      {/* Services Grid */}
      {services && services.length > 0 ? (
        <>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service: Service) => (
              <NavLink
                href={`/dashboard/services/${service.slug}`}
                key={service.id}
                className="group block h-full"
              >
                <Card className="h-full overflow-hidden p-0 gap-0 border-border/50 hover:border-primary/50 active:scale-[0.98] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                  {/* Cover Image Area */}
                  <div className="aspect-video relative overflow-hidden bg-muted/20">
                    {service.cover_image ? (
                      <Image
                        src={service.cover_image}
                        alt={service.name}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-transparent">
                        <HugeiconsIcon icon={ImageIcon} className="w-12 h-12 text-primary/20" />
                      </div>
                    )}

                    {/* Badge Overlay */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <div className="flex items-center gap-1 sm:gap-1.5 bg-background/90 backdrop-blur text-foreground px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold shadow-sm border border-border/50">
                        <HugeiconsIcon icon={Coins} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-500" />
                        <span>{formatXu(service.cost_per_second)} Xu/ảnh</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-5 flex flex-col">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg group-hover:text-primary transition-colors flex items-center gap-2">
                        {service.name}
                        <HugeiconsIcon icon={ArrowRight} className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary hidden sm:block" />
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-3 leading-relaxed line-clamp-2">
                        {service.description || "Tạo ảnh chất lượng cao với công nghệ AI tiên tiến."}
                      </p>
                    </div>
                  </div>
                </Card>
              </NavLink>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-2 sm:pt-4">
            <PaginationInfo
              currentPage={validPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={totalItems}
            />
            <Pagination
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={validPage}
              preserveParams={["search"]}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center bg-muted/20 rounded-3xl border border-dashed border-border/60">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted/50 mb-3 sm:mb-4">
            <HugeiconsIcon icon={Sparkles} className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground/60" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-1">Chưa có dịch vụ nào</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {search?.trim()
              ? "Không tìm thấy dịch vụ phù hợp. Thử từ khóa khác!"
              : "Hệ thống đang được cập nhật. Vui lòng quay lại sau!"}
          </p>
        </div>
      )}
    </div>
  )
}
