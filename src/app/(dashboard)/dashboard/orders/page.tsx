import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Download,
  ExternalLink,
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
    icon: <Clock className="h-4 w-4" />
  },
  processing: { 
    label: "Đang thực hiện", 
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    icon: <AlertCircle className="h-4 w-4" />
  },
  completed: { 
    label: "Hoàn thành", 
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    icon: <CheckCircle2 className="h-4 w-4" />
  },
  cancelled: { 
    label: "Đã hủy", 
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    icon: <XCircle className="h-4 w-4" />
  },
}

interface OrderWithService {
  id: string
  status: string
  total_cost: number
  user_inputs: Record<string, unknown>
  admin_output: { result_url?: string } | null
  admin_note: string | null
  created_at: string
  updated_at: string
  services: {
    name: string
    slug: string
  }
}

function OrderCard({ order }: { order: OrderWithService }) {
  const status = statusConfig[order.status]
  
  return (
    <Card className="overflow-hidden">
      <div className={`h-1 ${status.bgColor}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{order.services.name}</CardTitle>
            <CardDescription>
              Mã đơn: {order.id.slice(0, 8)}...
            </CardDescription>
          </div>
          <Badge className={`${status.color} ${status.bgColor} border-0`}>
            {status.icon}
            <span className="ml-1">{status.label}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Chi phí:</span>
          <span className="font-medium">{formatXu(order.total_cost)} Xu</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Ngày tạo:</span>
          <span>{formatDate(order.created_at)}</span>
        </div>
        
        {order.admin_note && (
          <div className="p-3 rounded-lg bg-muted/50 text-sm">
            <p className="font-medium mb-1">Ghi chú từ Admin:</p>
            <p className="text-muted-foreground">{order.admin_note}</p>
          </div>
        )}

        {order.status === 'completed' && order.admin_output?.result_url && (
          <Button className="w-full" asChild>
            <a href={order.admin_output.result_url} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Tải video kết quả
            </a>
          </Button>
        )}

        {order.status === 'pending' && (
          <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-sm text-yellow-700 dark:text-yellow-300">
            <p>Đơn hàng đang chờ Admin xử lý. Bạn sẽ được thông báo khi có kết quả.</p>
          </div>
        )}

        {order.status === 'processing' && (
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-700 dark:text-blue-300">
            <p>Admin đang thực hiện đơn hàng của bạn. Vui lòng chờ...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default async function OrdersPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch all orders
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      services (name, slug)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allOrders = (orders || []) as unknown as OrderWithService[]
  const pendingOrders = allOrders.filter(o => o.status === 'pending' || o.status === 'processing')
  const completedOrders = allOrders.filter(o => o.status === 'completed')
  const cancelledOrders = allOrders.filter(o => o.status === 'cancelled')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Đơn hàng của bạn</h1>
          <p className="text-muted-foreground">
            Theo dõi trạng thái và tải kết quả đơn hàng.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/services">
            Tạo đơn mới
          </Link>
        </Button>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="gap-2">
            Tất cả
            <Badge variant="secondary" className="ml-1">{allOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            Đang xử lý
            <Badge variant="secondary" className="ml-1">{pendingOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            Hoàn thành
            <Badge variant="secondary" className="ml-1">{completedOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="gap-2">
            Đã hủy
            <Badge variant="secondary" className="ml-1">{cancelledOrders.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {allOrders.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingOrders.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <EmptyState message="Không có đơn hàng đang xử lý" />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedOrders.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <EmptyState message="Chưa có đơn hàng hoàn thành" />
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledOrders.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cancelledOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <EmptyState message="Không có đơn hàng bị hủy" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({ message = "Bạn chưa có đơn hàng nào" }: { message?: string }) {
  return (
    <div className="text-center py-12">
      <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
      <p className="text-muted-foreground">{message}</p>
      <Button asChild className="mt-4">
        <Link href="/dashboard/services">Khám phá dịch vụ</Link>
      </Button>
    </div>
  )
}
