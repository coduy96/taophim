import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { ServiceOrderForm } from "@/components/service-order-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Coins, Sparkles, Info } from "lucide-react"
import Image from "next/image"

function formatXu(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch service
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!service) {
    notFound()
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('xu_balance, frozen_xu')
    .eq('id', user.id)
    .single()

  const hasEnoughBalance = (profile?.xu_balance || 0) >= service.base_cost

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/services">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách dịch vụ
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Service Info */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="group">
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            
            {/* Cover Image */}
            <div className="aspect-video relative bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden rounded-t-3xl">
              {service.cover_image ? (
                <Image
                  src={service.cover_image}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-16 w-16 text-primary/30" />
                </div>
              )}
            </div>
            <CardHeader className="relative">
              <CardTitle className="text-2xl">{service.name}</CardTitle>
              <CardDescription className="text-base">
                {service.description || "Dịch vụ tạo video AI chuyên nghiệp"}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium">Chi phí:</span>
                <Badge className="text-lg px-3 py-1 bg-primary text-primary-foreground rounded-full">
                  <Coins className="mr-1 h-4 w-4" />
                  {formatXu(service.base_cost)} Xu
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border/50">
                <span className="text-sm font-medium">Số dư của bạn:</span>
                <span className={`font-bold ${hasEnoughBalance ? 'text-green-600' : 'text-red-600'}`}>
                  {formatXu(profile?.xu_balance || 0)} Xu
                </span>
              </div>

              {!hasEnoughBalance && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-300">Số dư không đủ</p>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        Bạn cần thêm {formatXu(service.base_cost - (profile?.xu_balance || 0))} Xu để sử dụng dịch vụ này.
                      </p>
                      <Button size="sm" variant="outline" className="mt-2 rounded-full" asChild>
                        <Link href="/dashboard/wallet">Nạp Xu ngay</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Form */}
        <div className="lg:col-span-2">
          <Card className="group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <CardHeader className="relative">
              <CardTitle>Tạo đơn hàng</CardTitle>
              <CardDescription>
                Điền thông tin bên dưới để tạo đơn hàng. Admin sẽ xử lý và gửi kết quả cho bạn.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ServiceOrderForm 
                service={service} 
                hasEnoughBalance={hasEnoughBalance}
                userBalance={profile?.xu_balance || 0}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
