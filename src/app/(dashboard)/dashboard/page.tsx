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
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header Section - Hidden when HeroCTA is shown */}
      {!hasZeroBalance && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {greeting()}, {profile?.full_name || 'bạn hiền'}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Chào mừng trở lại với Taophim. Hôm nay bạn muốn tạo video gì?
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center">
              <HugeiconsIcon icon={Wallet} className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                Còn {formatXu(profile?.xu_balance || 0)} Xu
              </p>
              <p className="text-sm text-muted-foreground">Nạp thêm để tiếp tục tạo video</p>
            </div>
          </div>
          <Button asChild variant="outline" className="w-full sm:w-auto border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800">
            <Link href="/dashboard/wallet">
              Nạp Xu
              <HugeiconsIcon icon={ArrowRight} className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      {/* Stats Grid - Cleaner & Minimal */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/wallet" className="block group">
          <Card size="sm" className="bg-primary/5 border-primary/10 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Số dư hiện tại</CardTitle>
              <HugeiconsIcon icon={Wallet} className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatXu(profile?.xu_balance || 0)}</div>
              {profile && profile.frozen_xu > 0 ? (
                <p className="text-xs text-muted-foreground mt-1">
                  Đang giữ: {formatXu(profile.frozen_xu)}
                </p>
              ) : (
                <p className="text-xs text-primary/70 mt-1 group-hover:text-primary transition-colors">
                  Nhấn để nạp thêm →
                </p>
              )}
            </CardContent>
          </Card>
        </Link>

        <Card size="sm" className="hover:border-primary/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng đơn hàng</CardTitle>
            <HugeiconsIcon icon={ShoppingBag} className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Đơn hàng đã tạo</p>
          </CardContent>
        </Card>

        <Card size="sm" className="hover:border-primary/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang xử lý</CardTitle>
            <HugeiconsIcon icon={Clock} className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Đơn hàng đang chạy</p>
          </CardContent>
        </Card>

        <Card size="sm" className="hover:border-primary/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hoàn thành</CardTitle>
            <HugeiconsIcon icon={CheckCircle2} className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Đơn hàng thành công</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Đơn hàng gần đây</h2>
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/dashboard/orders">
              Xem tất cả <HugeiconsIcon icon={ArrowRight} className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Card className="border-none shadow-none bg-transparent">
           <div className="space-y-3">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="group flex items-center justify-between p-4 rounded-2xl border bg-card hover:border-primary/20 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <HugeiconsIcon icon={Sparkles} className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{(order.services as { name: string })?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
                      {formatXu(order.total_cost)} Xu
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusLabels[order.status].className}`}>
                      {statusLabels[order.status].label}
                    </span>
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/dashboard/orders?order=${order.id}`}>
                         <HugeiconsIcon icon={ArrowRight} className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed">
                <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                  <HugeiconsIcon icon={ShoppingBag} className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium">Chưa có đơn hàng nào</h3>
                <p className="text-sm text-muted-foreground max-w-[250px] mt-1 mb-4">
                  Hãy tạo đơn hàng đầu tiên để bắt đầu trải nghiệm dịch vụ.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/services">Khám phá dịch vụ</Link>
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
