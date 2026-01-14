import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, ArrowRight, Coins } from "lucide-react"
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          Dịch vụ AI Video
        </h1>
        <p className="text-muted-foreground">
          Chọn dịch vụ bạn muốn sử dụng. Mỗi dịch vụ có chi phí Xu khác nhau.
        </p>
      </div>

      {/* Services Grid */}
      {services && services.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service: Service) => (
            <Card 
              key={service.id} 
              className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Cover Image */}
              <div className="aspect-video relative bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
                {service.cover_image ? (
                  <Image
                    src={service.cover_image}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-16 w-16 text-primary/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1">
                    <Coins className="h-3.5 w-3.5" />
                    {formatXu(service.base_cost)} Xu
                  </span>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {service.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {service.description || "Dịch vụ tạo video AI chuyên nghiệp"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Button className="w-full group/btn" asChild>
                  <Link href={`/dashboard/services/${service.slug}`}>
                    Sử dụng dịch vụ
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium">Chưa có dịch vụ nào</h3>
          <p className="text-muted-foreground mt-1">
            Các dịch vụ sẽ được cập nhật sớm!
          </p>
        </div>
      )}
    </div>
  )
}
