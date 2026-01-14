import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Download,
  User,
  Coins,
  FileText
} from "lucide-react"
import { OrderActionForm } from "@/components/admin/order-action-form"

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

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check admin role
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch order with details
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      services (*),
      profiles (*)
    `)
    .eq('id', id)
    .single()

  if (error || !order) {
    notFound()
  }

  const status = statusConfig[order.status]
  const userInputs = order.user_inputs as Record<string, string | boolean>
  const adminOutput = order.admin_output as { result_url?: string } | null

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chi tiết đơn hàng</h1>
          <p className="text-muted-foreground">
            Mã đơn: {order.id}
          </p>
        </div>
        <Badge className={`${status.color} ${status.bgColor} border-0 text-base px-4 py-2`}>
          {status.icon}
          <span className="ml-2">{status.label}</span>
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Service Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Thông tin dịch vụ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dịch vụ:</span>
                <span className="font-medium">{(order.services as { name: string })?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chi phí:</span>
                <span className="font-medium text-primary">{formatXu(order.total_cost)} Xu</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày tạo:</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cập nhật:</span>
                <span>{formatDate(order.updated_at)}</span>
              </div>
            </CardContent>
          </Card>

          {/* User Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Dữ liệu từ khách hàng</CardTitle>
              <CardDescription>
                Các file và thông tin khách hàng đã gửi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(userInputs).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/50">
                    <span className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                    {typeof value === 'string' && value.startsWith('http') ? (
                      <Button variant="outline" asChild className="w-fit">
                        <a href={value} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          Tải xuống file
                        </a>
                      </Button>
                    ) : typeof value === 'boolean' ? (
                      <span className="text-muted-foreground">{value ? 'Có' : 'Không'}</span>
                    ) : (
                      <span className="text-muted-foreground">{value as string}</span>
                    )}
                  </div>
                ))}
                {Object.keys(userInputs).length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Không có dữ liệu
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Admin Output (if exists) */}
          {adminOutput?.result_url && (
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-green-600">Kết quả đã tải lên</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a href={adminOutput.result_url} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Xem kết quả
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          {order.admin_note && (
            <Card>
              <CardHeader>
                <CardTitle>Ghi chú Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{order.admin_note}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Họ tên</p>
                <p className="font-medium">
                  {(order.profiles as { full_name: string | null })?.full_name || 'Chưa cập nhật'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{(order.profiles as { email: string })?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số dư hiện tại</p>
                <p className="font-medium text-primary">
                  {formatXu((order.profiles as { xu_balance: number })?.xu_balance || 0)} Xu
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {(order.status === 'pending' || order.status === 'processing') && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Hành động</CardTitle>
                <CardDescription>
                  Xử lý đơn hàng này
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrderActionForm 
                  orderId={order.id} 
                  currentStatus={order.status}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
