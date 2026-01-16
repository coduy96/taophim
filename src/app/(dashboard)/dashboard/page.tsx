import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  AnalyticsUpIcon as TrendingUp
} from "@hugeicons/core-free-icons"

function formatXu(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xử lý", color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30" },
  processing: { label: "Đang thực hiện", color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
  completed: { label: "Hoàn thành", color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
  cancelled: { label: "Đã hủy", color: "text-red-600 bg-red-100 dark:bg-red-900/30" },
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số dư Xu</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <HugeiconsIcon icon={Wallet} className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-primary">{formatXu(profile?.xu_balance || 0)}</div>
            {profile && profile.frozen_xu > 0 && (
              <p className="text-xs text-muted-foreground">
                Đang giữ: {formatXu(profile.frozen_xu)} Xu
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <HugeiconsIcon icon={ShoppingBag} className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả đơn hàng của bạn
            </p>
          </CardContent>
        </Card>

        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <HugeiconsIcon icon={Clock} className="h-5 w-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{pendingOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Đơn hàng chờ hoàn thành
            </p>
          </CardContent>
        </Card>

        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <HugeiconsIcon icon={CheckCircle2} className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{completedOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Đơn hàng đã xong
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
              <HugeiconsIcon icon={Sparkles} className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="group-hover:text-primary transition-colors">
              Tạo video mới
            </CardTitle>
            <CardDescription>
              Khám phá các dịch vụ AI video của chúng tôi
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Button asChild className="rounded-full">
              <Link href="/dashboard/services">
                Xem dịch vụ
                <HugeiconsIcon icon={ArrowRight} className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
              <HugeiconsIcon icon={TrendingUp} className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="group-hover:text-primary transition-colors">
              Nạp thêm Xu
            </CardTitle>
            <CardDescription>
              Liên hệ Admin để nạp Xu vào tài khoản
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Button variant="outline" asChild className="rounded-full">
              <Link href="/dashboard/wallet">
                Xem ví của bạn
                <HugeiconsIcon icon={ArrowRight} className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="relative flex flex-row items-center justify-between">
          <div>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>Các đơn hàng mới nhất của bạn</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="rounded-full">
            <Link href="/dashboard/orders">
              Xem tất cả
              <HugeiconsIcon icon={ArrowRight} className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="relative">
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-background hover:bg-muted/50 transition-all duration-300"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{(order.services as { name: string })?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">
                      {formatXu(order.total_cost)} Xu
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusLabels[order.status].color}`}>
                      {statusLabels[order.status].label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <HugeiconsIcon icon={ShoppingBag} className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Bạn chưa có đơn hàng nào</p>
              <Button asChild className="mt-4 rounded-full">
                <Link href="/dashboard/services">Tạo đơn hàng đầu tiên</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
