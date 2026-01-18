import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  PlusSignIcon as Plus, 
  SparklesIcon as Sparkles, 
  Edit02Icon as Edit, 
  Film01Icon as Film 
} from "@hugeicons/core-free-icons"
import Image from "next/image"
import { DeleteServiceButton } from "@/components/admin/delete-service-button"

function formatXu(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

interface Service {
  id: string
  slug: string
  name: string
  description: string | null
  cost_per_second: number
  is_active: boolean
  cover_image: string | null
  created_at: string
}

export default async function AdminServicesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch all services
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <HugeiconsIcon icon={Sparkles} className="h-6 w-6 text-primary" />
          </div>
          Quản lý dịch vụ
        </h1>
          <p className="text-muted-foreground mt-2">
            Thêm, sửa, xóa các dịch vụ AI Video.
          </p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/admin/services/new">
            <HugeiconsIcon icon={Plus} className="mr-2 h-4 w-4" />
            Thêm dịch vụ
          </Link>
        </Button>
      </div>

      {/* Services List */}
      {services && services.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service: Service) => (
            <Card key={service.id} className="group">
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              
              {/* Cover */}
              <div className="aspect-[16/10] relative overflow-hidden rounded-t-3xl">
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
                <div className="absolute top-4 right-4 z-10">
                  <Badge 
                    variant={service.is_active ? "default" : "secondary"}
                    className="rounded-full px-3"
                  >
                    {service.is_active ? "Hoạt động" : "Tạm dừng"}
                  </Badge>
                </div>
              </div>
              <CardHeader className="relative pb-2">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">{service.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {service.description || "Không có mô tả"}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Giá mỗi giây:</span>
                  <span className="font-medium text-primary">{formatXu(service.cost_per_second)} Xu/giây</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Slug:</span>
                  <code className="text-xs bg-muted px-2 py-0.5 rounded-full">{service.slug}</code>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ngày tạo:</span>
                  <span>{formatDate(service.created_at)}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 rounded-full" asChild>
                    <Link href={`/admin/services/${service.id}`}>
                      <HugeiconsIcon icon={Edit} className="mr-2 h-4 w-4" />
                      Sửa
                    </Link>
                  </Button>
                  <DeleteServiceButton serviceId={service.id} serviceName={service.name} />
                </div>
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
          <p className="text-muted-foreground max-w-sm mx-auto mb-4">
            Tạo dịch vụ đầu tiên để bắt đầu nhận đơn hàng.
          </p>
          <Button asChild className="rounded-full">
            <Link href="/admin/services/new">
              <HugeiconsIcon icon={Plus} className="mr-2 h-4 w-4" />
              Thêm dịch vụ
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
