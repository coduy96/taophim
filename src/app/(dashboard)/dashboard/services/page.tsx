import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { NavLink } from "@/components/nav-link"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  SparklesIcon as Sparkles, 
  ArrowRight01Icon as ArrowRight, 
  Coins01Icon as Coins, 
  Film01Icon as Film,
  Search01Icon as Search
} from "@hugeicons/core-free-icons"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationInfo } from "@/components/ui/pagination"

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

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1)
  const supabase = await createClient()
  
  // Parallel fetch: User check + Data with Count
  const [userResult, servicesResult] = await Promise.all([
    supabase.auth.getUser(),
    (async () => {
      // We can't easily do offset pagination with unknown total count to validate range before fetching.
      // But we can fetch count and data in one go if we trust the page param or handle empty data gracefully.
      // Or we fetch count first then data. But let's try to combine if possible.
      // Actually, Supabase .range() works fine even if out of bounds (returns empty).
      // So let's fetch data and count together.
      
      // Calculate offset based on assumed page
      const offset = (currentPage - 1) * ITEMS_PER_PAGE
      
      return supabase
        .from('services')
        .select('*', { count: 'exact' })
        .is('deleted_at', null)
        .eq('is_active', true)
        .order('created_at', { ascending: true })
        .range(offset, offset + ITEMS_PER_PAGE - 1)
    })()
  ])

  const { data: { user } } = userResult
  if (!user) redirect('/login')

  const { data: services, count: totalCount } = servicesResult
  const totalItems = totalCount || 0
  const validPage = currentPage // We used this for fetching, so it's the current page context
  
  // Recalculate pagination info
  // If user requested page 10 but there are only 5 pages, 'services' will be empty.
  // The UI handles empty services gracefully.
  // Ideally, we should redirect to the last page if page > totalPages, but just showing empty is faster/simpler.


  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header Section - Matches Dashboard Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dịch vụ AI Video</h1>
          <p className="text-muted-foreground mt-1">
            Khám phá các công cụ tạo video mạnh mẽ được hỗ trợ bởi AI.
          </p>
        </div>
        
        {/* Optional Search/Filter placeholder - Keeps it minimal but functional-looking */}
        <div className="relative w-full md:w-auto md:min-w-[300px]">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <HugeiconsIcon icon={Search} className="h-4 w-4 text-muted-foreground" />
           </div>
           <Input 
             type="text" 
             placeholder="Tìm kiếm dịch vụ..." 
             className="pl-10 bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus-visible:ring-primary/20"
             disabled // Disabled for now as it's client-side logic we might add later or just a UI placeholder
           />
        </div>
      </div>

      {/* Services Grid */}
      {services && services.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service: Service) => (
              <NavLink
                href={`/dashboard/services/${service.slug}`}
                key={service.id}
                className="group block h-full"
              >
                <Card className="h-full overflow-hidden p-0 gap-0 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
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
                        <HugeiconsIcon icon={Film} className="w-12 h-12 text-primary/20" />
                      </div>
                    )}
                    
                    {/* Badge Overlay */}
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur text-foreground px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm border border-border/50">
                        <HugeiconsIcon icon={Coins} className="w-3.5 h-3.5 text-yellow-500" />
                        <span>{formatXu(service.cost_per_second)} Xu/giây</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors flex items-center gap-2">
                        {service.name}
                        <HugeiconsIcon icon={ArrowRight} className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                      </h3>
                      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                        {service.description || "Tạo video chất lượng cao với công nghệ AI tiên tiến."}
                      </p>
                    </div>
                  </div>
                </Card>
              </NavLink>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <PaginationInfo
              currentPage={validPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={totalItems}
            />
            <Pagination
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={validPage}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-muted/20 rounded-3xl border border-dashed border-border/60">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
            <HugeiconsIcon icon={Sparkles} className="w-8 h-8 text-muted-foreground/60" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Chưa có dịch vụ nào</h3>
          <p className="text-muted-foreground max-w-sm">
            Hệ thống đang được cập nhật. Vui lòng quay lại sau!
          </p>
        </div>
      )}
    </div>
  )
}
