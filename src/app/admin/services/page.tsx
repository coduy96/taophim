import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Sparkles, Edit, Trash2 } from "lucide-react"
import Image from "next/image"

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
  base_cost: number
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
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý dịch vụ</h1>
          <p className="text-muted-foreground">
            Thêm, sửa, xóa các dịch vụ AI Video.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Thêm dịch vụ
          </Link>
        </Button>
      </div>

      {/* Services List */}
      {services && services.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service: Service) => (
            <Card key={service.id} className="overflow-hidden">
              {/* Cover */}
              <div className="aspect-video relative bg-gradient-to-br from-primary/20 to-primary/5">
                {service.cover_image ? (
                  <Image
                    src={service.cover_image}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-12 w-12 text-primary/30" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={service.is_active ? "default" : "secondary"}>
                    {service.is_active ? "Hoạt động" : "Tạm dừng"}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {service.description || "Không có mô tả"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Giá:</span>
                  <span className="font-medium text-primary">{formatXu(service.base_cost)} Xu</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Slug:</span>
                  <code className="text-xs bg-muted px-1 rounded">{service.slug}</code>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ngày tạo:</span>
                  <span>{formatDate(service.created_at)}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <Link href={`/admin/services/${service.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Sửa
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium">Chưa có dịch vụ nào</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Tạo dịch vụ đầu tiên để bắt đầu nhận đơn hàng.
          </p>
          <Button asChild>
            <Link href="/admin/services/new">
              <Plus className="mr-2 h-4 w-4" />
              Thêm dịch vụ
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
