import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { ServiceOrderForm } from "@/components/service-order-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ArrowLeft01Icon as ArrowLeft, 
  Coins01Icon as Coins, 
  SparklesIcon as Sparkles, 
  InformationCircleIcon as Info,
  CheckmarkCircle02Icon as CheckCircle
} from "@hugeicons/core-free-icons"
import Image from "next/image"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: service } = await supabase
    .from('services')
    .select('name, description')
    .eq('slug', slug)
    .is('deleted_at', null)
    .single()

  if (!service) {
    return {
      title: "Dịch vụ không tồn tại",
    }
  }

  return {
    title: service.name,
    description: service.description || `Sử dụng dịch vụ ${service.name} tại Taophim - Nền tảng tạo video AI hàng đầu Việt Nam.`,
    openGraph: {
      title: `${service.name} | Taophim`,
      description: service.description || `Sử dụng dịch vụ ${service.name} tại Taophim.`,
    },
  }
}

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
  
  const [userResult, serviceResult] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .is('deleted_at', null)
      .eq('is_active', true)
      .single()
  ])

  const { data: { user } } = userResult
  if (!user) redirect('/login')

  const { data: service } = serviceResult

  if (!service) {
    notFound()
  }

  // Fetch user profile (dependent on user)
  const { data: profile } = await supabase
    .from('profiles')
    .select('xu_balance, frozen_xu')
    .eq('id', user.id)
    .single()

  // Check if user can afford at least 1 second of video
  const hasEnoughBalance = (profile?.xu_balance || 0) >= service.cost_per_second

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header Section */}
      <div className="space-y-4">

        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{service.name}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
              {service.description || "Dịch vụ tạo video AI chuyên nghiệp"}
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="hidden md:flex">
            <Link href="/dashboard/services">
              <HugeiconsIcon icon={ArrowLeft} className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Service Info & Cost */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-border/50 shadow-sm">
            <div className="aspect-video relative bg-muted/30">
              {service.cover_image ? (
                <Image
                  src={service.cover_image}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <HugeiconsIcon icon={Sparkles} className="h-12 w-12 text-muted-foreground/20" />
                </div>
              )}
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Chi phí dịch vụ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
                <span className="text-sm font-medium text-muted-foreground">Giá mỗi giây</span>
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Coins} className="h-4 w-4 text-primary" />
                  <span className="font-bold text-lg text-foreground">{formatXu(service.cost_per_second)} Xu/giây</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Số dư hiện tại:</span>
                  <span className="font-medium">{formatXu(profile?.xu_balance || 0)} Xu</span>
                </div>

                {!hasEnoughBalance ? (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 space-y-2">
                    <div className="flex gap-2">
                      <HugeiconsIcon icon={Info} className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">Số dư không đủ</p>
                    </div>
                    <p className="text-xs text-red-600/80 dark:text-red-400/80 pl-6">
                      Cần tối thiểu {formatXu(service.cost_per_second)} Xu cho 1 giây video.
                    </p>
                    <Button size="sm" variant="destructive" className="w-full mt-2" asChild>
                      <Link href="/dashboard/wallet">Nạp Xu ngay</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-950/30 p-2.5 rounded-lg border border-green-200 dark:border-green-900/50">
                    <HugeiconsIcon icon={CheckCircle} className="h-4 w-4" />
                    <span>Số dư đủ để thực hiện</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted/30 rounded-xl p-4 text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Lưu ý:</p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Kết quả sẽ được AI tạo trong vòng 1-24h.</li>
              <li>Xu sẽ bị tạm giữ khi tạo đơn và trừ khi hoàn thành.</li>
              <li>Nếu đơn hàng bị hủy, Xu sẽ được hoàn trả 100%.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Order Form */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Thông tin yêu cầu</CardTitle>
              <CardDescription>
                Điền đầy đủ thông tin bên dưới để hệ thống AI xử lý yêu cầu của bạn chính xác nhất.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
