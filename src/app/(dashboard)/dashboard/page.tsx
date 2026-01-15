import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Wallet,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp
} from "lucide-react"

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số dư Xu</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatXu(profile?.xu_balance || 0)}</div>
            {profile && profile.frozen_xu > 0 && (
              <p className="text-xs text-muted-foreground">
                Đang giữ: {formatXu(profile.frozen_xu)} Xu
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả đơn hàng của bạn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Đơn hàng chờ hoàn thành
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Đơn hàng đã xong
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Tạo video mới
            </CardTitle>
            <CardDescription>
              Khám phá các dịch vụ AI video của chúng tôi
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Button asChild>
              <Link href="/dashboard/services">
                Xem dịch vụ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Nạp thêm Xu
            </CardTitle>
            <CardDescription>
              Liên hệ Admin để nạp Xu vào tài khoản
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/dashboard/wallet">
                Xem ví của bạn
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>Các đơn hàng mới nhất của bạn</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/orders">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
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
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusLabels[order.status].color}`}>
                      {statusLabels[order.status].label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Bạn chưa có đơn hàng nào</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/services">Tạo đơn hàng đầu tiên</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
