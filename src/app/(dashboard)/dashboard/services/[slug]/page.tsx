import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { ServiceOrderForm } from "@/components/service-order-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { NavLink } from "@/components/nav-link"
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
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-8 pb-4">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 lg:hidden">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 -ml-2">
              <NavLink href="/dashboard/services">
                <HugeiconsIcon icon={ArrowLeft} className="h-4 w-4" />
              </NavLink>
            </Button>
            <span className="text-xs text-muted-foreground">Dịch vụ</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{service.name}</h1>
          <p className="text-muted-foreground text-sm md:text-base mt-0.5 md:mt-2 max-w-2xl">
            {service.description || "Dịch vụ tạo video AI chuyên nghiệp"}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="hidden lg:flex flex-shrink-0">
          <NavLink href="/dashboard/services">
            <HugeiconsIcon icon={ArrowLeft} className="mr-2 h-4 w-4" />
            Quay lại
          </NavLink>
        </Button>
      </div>

      {/* Mobile: Compact cost + balance bar */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/40 border border-border/50 lg:hidden">
        <div className="flex items-center gap-2 min-w-0">
          <HugeiconsIcon icon={Coins} className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="text-sm font-semibold">{formatXu(service.cost_per_second)} Xu/giây</span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          {hasEnoughBalance ? (
            <span className="text-xs text-green-600 dark:text-green-500 font-medium flex items-center gap-1">
              <HugeiconsIcon icon={CheckCircle} className="h-3.5 w-3.5" />
              {formatXu(profile?.xu_balance || 0)} Xu
            </span>
          ) : (
            <Button size="sm" variant="destructive" asChild className="h-7 text-xs">
              <NavLink href="/dashboard/wallet">Nạp Xu</NavLink>
            </Button>
          )}
        </div>
      </div>

      <div className="grid min-w-0 gap-4 md:gap-8 lg:grid-cols-3">
        {/* Order Form - appears FIRST on mobile */}
        <div className="order-first lg:order-last lg:col-span-2 min-w-0">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Thông tin yêu cầu</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Điền thông tin bên dưới để AI xử lý yêu cầu chính xác nhất.
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

        {/* Service Info - appears SECOND on mobile, FIRST (left) on desktop */}
        <div className="order-last lg:order-first lg:col-span-1 space-y-4 md:space-y-6 min-w-0">
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
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Chi phí dịch vụ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-3 rounded-lg bg-primary/5 border border-primary/10">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Giá mỗi giây</span>
                <div className="flex items-center gap-1.5 min-w-0">
                  <HugeiconsIcon icon={Coins} className="h-4 w-4 text-primary" />
                  <span className="font-bold text-base sm:text-lg text-foreground">{formatXu(service.cost_per_second)} Xu/giây</span>
                </div>
              </div>

              <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Số dư hiện tại:</span>
                  <span className="font-medium">{formatXu(profile?.xu_balance || 0)} Xu</span>
                </div>

                {!hasEnoughBalance ? (
                  <div className="p-2.5 sm:p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 space-y-2">
                    <div className="flex gap-2">
                      <HugeiconsIcon icon={Info} className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">Số dư không đủ</p>
                    </div>
                    <p className="text-xs text-red-600/80 dark:text-red-400/80 pl-6">
                      Cần tối thiểu {formatXu(service.cost_per_second)} Xu cho 1 giây video.
                    </p>
                    <Button size="sm" variant="destructive" className="w-full mt-2" asChild>
                      <NavLink href="/dashboard/wallet">Nạp Xu ngay</NavLink>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-950/30 p-2 sm:p-2.5 rounded-lg border border-green-200 dark:border-green-900/50">
                    <HugeiconsIcon icon={CheckCircle} className="h-4 w-4" />
                    <span>Số dư đủ để thực hiện</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted/30 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Lưu ý:</p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Kết quả sẽ được AI tạo trong vòng 3-30 phút.</li>
              <li>Bạn sẽ nhận được thông báo khi đơn hàng hoàn thành.</li>
              <li>Xu sẽ bị tạm giữ khi tạo đơn và trừ khi hoàn thành.</li>
              <li>Nếu đơn hàng bị hủy, Xu sẽ được hoàn trả 100%.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
