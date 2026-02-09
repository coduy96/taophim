import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Wallet01Icon as Wallet,
  ShoppingBag01Icon as ShoppingBag,
  Time01Icon as Clock,
  CheckmarkCircle02Icon as CheckCircle2,
  ArrowRight01Icon as ArrowRight,
  SparklesIcon as Sparkles,
  Film01Icon as Film
} from "@hugeicons/core-free-icons"
import { HeroCTA } from "@/components/dashboard/hero-cta"

const LOW_BALANCE_THRESHOLD = 100

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

const statusLabels: Record<string, { label: string; className: string }> = {
  pending: { label: "Chờ xử lý", className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
  processing: { label: "Đang thực hiện", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  completed: { label: "Hoàn thành", className: "bg-green-500/10 text-green-600 dark:text-green-400" },
  cancelled: { label: "Đã hủy", className: "bg-red-500/10 text-red-600 dark:text-red-400" },
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select(`
      *,
      services (name, slug)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch order stats
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: completedOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'completed')

  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .in('status', ['pending', 'processing'])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Chào buổi sáng"
    if (hour < 18) return "Chào buổi chiều"
    return "Chào buổi tối"
  }

  const isLowBalance = (profile?.xu_balance || 0) < LOW_BALANCE_THRESHOLD
  const hasZeroBalance = (profile?.xu_balance || 0) === 0

  return (
    <div className="max-w-6xl mx-auto space-y-5 md:space-y-8 pb-4">
      {/* Header Section - Hidden when HeroCTA is shown */}
      {!hasZeroBalance && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              {greeting()}, {profile?.full_name || 'bạn hiền'}! 👋
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mt-0.5 md:mt-1">
              Hôm nay bạn muốn tạo video gì?
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild size="default" className="rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 md:size-lg w-full sm:w-auto">
              <Link href="/dashboard/services">
                <HugeiconsIcon icon={Film} className="mr-2 h-5 w-5" />
                Tạo video mới
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Prominent Low Balance / Zero Balance Banner */}
      {hasZeroBalance && <HeroCTA />}

      {isLowBalance && !hasZeroBalance && (
        <Link href="/dashboard/wallet" className="flex items-center justify-between gap-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 sm:p-4 active:scale-[0.98] transition-transform">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center">
              <HugeiconsIcon icon={Wallet} className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground text-sm sm:text-base truncate">
                Còn {formatXu(profile?.xu_balance || 0)} Xu
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Nhấn để nạp thêm</p>
            </div>
          </div>
          <HugeiconsIcon icon={ArrowRight} className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </Link>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Link href="/dashboard/wallet" className="block group">
          <Card size="sm" className="bg-primary/5 border-primary/10 hover:border-primary/30 hover:shadow-md active:scale-[0.97] transition-all cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Số dư</CardTitle>
              <HugeiconsIcon icon={Wallet} className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-primary">{formatXu(profile?.xu_balance || 0)}</div>
              {profile && profile.frozen_xu > 0 ? (
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                  Đang giữ: {formatXu(profile.frozen_xu)}
                </p>
              ) : (
                <p className="text-[11px] sm:text-xs text-primary/70 mt-0.5 sm:mt-1 group-hover:text-primary transition-colors">
                  Nạp thêm →
                </p>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/orders" className="block group">
          <Card size="sm" className="hover:border-primary/20 active:scale-[0.97] transition-all cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Tổng đơn</CardTitle>
              <HugeiconsIcon icon={ShoppingBag} className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{totalOrders || 0}</div>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Đã tạo</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/orders?status=processing" className="block group">
          <Card size="sm" className="hover:border-primary/20 active:scale-[0.97] transition-all cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Đang xử lý</CardTitle>
              <HugeiconsIcon icon={Clock} className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{pendingOrders || 0}</div>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Đang chạy</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/orders?status=completed" className="block group">
          <Card size="sm" className="hover:border-primary/20 active:scale-[0.97] transition-all cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Hoàn thành</CardTitle>
              <HugeiconsIcon icon={CheckCircle2} className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{completedOrders || 0}</div>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Thành công</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold tracking-tight">Đơn hàng gần đây</h2>
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground -mr-2">
            <Link href="/dashboard/orders">
              Xem tất cả <HugeiconsIcon icon={ArrowRight} className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {recentOrders && recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders?order=${order.id}`}
                className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border bg-card hover:border-primary/20 hover:shadow-sm active:scale-[0.98] transition-all duration-200"
              >
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <HugeiconsIcon icon={Sparkles} className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm sm:text-base truncate">{(order.services as { name: string })?.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-medium flex-shrink-0 ${statusLabels[order.status].className}`}>
                      {statusLabels[order.status].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.created_at)}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      &middot; {formatXu(order.total_cost)} Xu
                    </span>
                  </div>
                </div>
                <HugeiconsIcon icon={ArrowRight} className="h-4 w-4 text-muted-foreground flex-shrink-0 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-center rounded-2xl border border-dashed">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <HugeiconsIcon icon={ShoppingBag} className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-sm sm:text-base">Chưa có đơn hàng nào</h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-[250px] mt-1 mb-4">
                Hãy tạo đơn hàng đầu tiên để bắt đầu trải nghiệm dịch vụ.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/services">Khám phá dịch vụ</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
