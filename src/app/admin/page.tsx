import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Users,
  TrendingUp,
  Coins,
  ArrowRight,
  AlertCircle
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

export default async function AdminDashboardPage() {
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

  // Fetch stats
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: processingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'processing')

  // Total revenue (completed orders)
  const { data: completedOrders } = await supabase
    .from('orders')
    .select('total_cost')
    .eq('status', 'completed')

  const totalRevenue = completedOrders?.reduce((sum, o) => sum + o.total_cost, 0) || 0

  // Recent pending orders
  const { data: recentPendingOrders } = await supabase
    .from('orders')
    .select(`
      *,
      services (name),
      profiles (email, full_name)
    `)
    .in('status', ['pending', 'processing'])
    .order('created_at', { ascending: true })
    .limit(5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Tổng quan về hoạt động của hệ thống.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn chờ xử lý</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Cần xử lý ngay
            </p>
          </CardContent>
        </Card>

        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang thực hiện</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <AlertCircle className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-blue-600">{processingOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Đang trong quá trình
            </p>
          </CardContent>
        </Card>

        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Người dùng đăng ký
            </p>
          </CardContent>
        </Card>

        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Coins className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-green-600">{formatXu(totalRevenue)} Xu</div>
            <p className="text-xs text-muted-foreground">
              Từ {completedOrders?.length || 0} đơn hoàn thành
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
          <CardHeader className="relative pb-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
              <ShoppingBag className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">Xử lý đơn hàng</CardTitle>
            <CardDescription>
              Có {pendingOrders || 0} đơn đang chờ xử lý
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Button asChild className="w-full rounded-full">
              <Link href="/admin/orders">
                Xem đơn hàng
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
          <CardHeader className="relative pb-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">Quản lý dịch vụ</CardTitle>
            <CardDescription>
              Thêm, sửa, xóa các dịch vụ
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Button variant="outline" asChild className="w-full rounded-full">
              <Link href="/admin/services">
                Quản lý dịch vụ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
          <CardHeader className="relative pb-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">Nạp Xu cho user</CardTitle>
            <CardDescription>
              Cộng Xu sau khi nhận thanh toán
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Button variant="outline" asChild className="w-full rounded-full">
              <Link href="/admin/users">
                Quản lý người dùng
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Pending Orders */}
      <Card className="group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
        <CardHeader className="relative flex flex-row items-center justify-between">
          <div>
            <CardTitle>Đơn hàng cần xử lý</CardTitle>
            <CardDescription>Các đơn hàng đang chờ hoặc đang thực hiện</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="rounded-full">
            <Link href="/admin/orders">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="relative">
          {recentPendingOrders && recentPendingOrders.length > 0 ? (
            <div className="space-y-4">
              {recentPendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-background hover:bg-muted/50 transition-all duration-300"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{(order.services as { name: string })?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(order.profiles as { email: string })?.email} • {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">
                      {formatXu(order.total_cost)} Xu
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusLabels[order.status].color}`}>
                      {statusLabels[order.status].label}
                    </span>
                    <Button size="sm" asChild className="rounded-full">
                      <Link href={`/admin/orders/${order.id}`}>
                        Xử lý
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <p>Không có đơn hàng nào cần xử lý</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
