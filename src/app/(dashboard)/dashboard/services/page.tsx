import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  SparklesIcon as Sparkles, 
  ArrowRight01Icon as ArrowRight, 
  Coins01Icon as Coins, 
  PlayIcon as Play, 
  Film01Icon as Film 
} from "@hugeicons/core-free-icons"
import Image from "next/image"

function formatXu(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

interface Service {
  id: string
  slug: string
  name: string
  description: string | null
  base_cost: number
  is_active: boolean
  cover_image: string | null
}

export default async function ServicesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch active services
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <HugeiconsIcon icon={Sparkles} className="h-6 w-6 text-primary" />
          </div>
          Dịch vụ AI Video
        </h1>
        <p className="text-muted-foreground">
          Chọn dịch vụ bạn muốn sử dụng. Mỗi dịch vụ có chi phí Xu khác nhau.
        </p>
      </div>

      {/* Services Grid */}
      {services && services.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service: Service) => (
            <Card 
              key={service.id} 
              className="group"
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              
              {/* Cover Image */}
              <div className="aspect-[16/10] relative overflow-hidden rounded-t-3xl">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                
                {service.cover_image ? (
                  <Image
                    src={service.cover_image}
                    alt={service.name}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                    <HugeiconsIcon icon={Film} className="w-12 h-12 text-primary/20" />
                  </div>
                )}
                
                {/* Floating Price Tag */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                    <HugeiconsIcon icon={Coins} className="w-3.5 h-3.5 text-yellow-400" />
                    <span>{formatXu(service.base_cost)} Xu</span>
                  </div>
                </div>
                
                {/* Play Button Overlay (Hover) */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                  <div className="w-14 h-14 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 backdrop-blur-sm">
                    <HugeiconsIcon icon={Play} className="w-6 h-6 ml-1 fill-current" />
                  </div>
                </div>
              </div>

              <CardHeader className="relative pb-2">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {service.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {service.description || "Dịch vụ tạo video AI chuyên nghiệp"}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative">
                <Button className="w-full group/btn rounded-full" asChild>
                  <Link href={`/dashboard/services/${service.slug}`}>
                    Sử dụng dịch vụ
                    <HugeiconsIcon icon={ArrowRight} className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border/50">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <HugeiconsIcon icon={Sparkles} className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Chưa có dịch vụ nào</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Các dịch vụ sẽ được cập nhật sớm!
          </p>
        </div>
      )}
    </div>
  )
}
