import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ShoppingBag01Icon as ShoppingBag, 
  Time01Icon as Clock, 
  CheckmarkCircle02Icon as CheckCircle2, 
  CancelCircleIcon as XCircle,
  AlertCircleIcon as AlertCircle,
  ViewIcon as Eye
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

const statusConfig: Record<string, { 
  label: string
  color: string
  icon: React.ReactNode
  bgColor: string
}> = {
  pending: { 
    label: "Chờ xử lý", 
    color: "text-yellow-600", 
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    icon: <HugeiconsIcon icon={Clock} className="h-4 w-4" />
  },
  processing: { 
    label: "Đang thực hiện", 
    color: "text-blue-600", 
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    icon: <HugeiconsIcon icon={AlertCircle} className="h-4 w-4" />
  },
  completed: { 
    label: "Hoàn thành", 
    color: "text-green-600", 
    bgColor: "bg-green-100 dark:bg-green-900/30",
    icon: <HugeiconsIcon icon={CheckCircle2} className="h-4 w-4" />
  },
  cancelled: { 
    label: "Đã hủy", 
    color: "text-red-600", 
    bgColor: "bg-red-100 dark:bg-red-900/30",
    icon: <HugeiconsIcon icon={XCircle} className="h-4 w-4" />
  },
}

interface OrderWithDetails {
  id: string
  status: string
  total_cost: number
  created_at: string
  updated_at: string
  services: { name: string; slug: string }
  profiles: { email: string; full_name: string | null }
}

function OrderRow({ order }: { order: OrderWithDetails }) {
  const status = statusConfig[order.status]
  
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-background hover:bg-muted/50 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${status.bgColor}`}>
          {status.icon}
        </div>
        <div>
          <p className="font-medium">{order.services?.name}</p>
          <p className="text-sm text-muted-foreground">
            {order.profiles?.full_name || order.profiles?.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium">{formatXu(order.total_cost)} Xu</p>
          <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
        </div>
        <Badge className={`${status.color} ${status.bgColor} border-0 rounded-full px-3`}>
          {status.label}
        </Badge>
        <Button size="sm" asChild className="rounded-full">
          <Link href={`/admin/orders/${order.id}`}>
            <HugeiconsIcon icon={Eye} className="mr-2 h-4 w-4" />
            Xem
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default async function AdminOrdersPage() {
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

  // Fetch all orders
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      services (name, slug),
      profiles (email, full_name)
    `)
    .order('created_at', { ascending: false })

  const allOrders = (orders || []) as unknown as OrderWithDetails[]
  const pendingOrders = allOrders.filter(o => o.status === 'pending')
  const processingOrders = allOrders.filter(o => o.status === 'processing')
  const completedOrders = allOrders.filter(o => o.status === 'completed')
  const cancelledOrders = allOrders.filter(o => o.status === 'cancelled')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <HugeiconsIcon icon={ShoppingBag} className="h-6 w-6 text-primary" />
          </div>
          Quản lý đơn hàng
        </h1>
        <p className="text-muted-foreground mt-2">
          Xem và xử lý tất cả đơn hàng từ người dùng.
        </p>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 rounded-full p-1">
          <TabsTrigger value="pending" className="gap-2 rounded-full">
            Chờ xử lý
            {pendingOrders.length > 0 && (
              <Badge variant="destructive" className="ml-1 rounded-full">{pendingOrders.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="processing" className="gap-2 rounded-full">
            Đang thực hiện
            <Badge variant="secondary" className="ml-1 rounded-full">{processingOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2 rounded-full">
            Hoàn thành
            <Badge variant="secondary" className="ml-1 rounded-full">{completedOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="gap-2 rounded-full">
            Đã hủy
            <Badge variant="secondary" className="ml-1 rounded-full">{cancelledOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2 rounded-full">
            Tất cả
            <Badge variant="secondary" className="ml-1 rounded-full">{allOrders.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingOrders.length > 0 ? (
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <EmptyState message="Không có đơn hàng chờ xử lý" />
          )}
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          {processingOrders.length > 0 ? (
            <div className="space-y-3">
              {processingOrders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <EmptyState message="Không có đơn hàng đang thực hiện" />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedOrders.length > 0 ? (
            <div className="space-y-3">
              {completedOrders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <EmptyState message="Chưa có đơn hàng hoàn thành" />
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledOrders.length > 0 ? (
            <div className="space-y-3">
              {cancelledOrders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <EmptyState message="Không có đơn hàng bị hủy" />
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {allOrders.length > 0 ? (
            <div className="space-y-3">
              {allOrders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <EmptyState message="Chưa có đơn hàng nào" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border/50">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <HugeiconsIcon icon={ShoppingBag} className="w-8 h-8 text-muted-foreground/50" />
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}
