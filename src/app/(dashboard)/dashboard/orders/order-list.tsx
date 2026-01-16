"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ShoppingBag01Icon as ShoppingBag, 
  Time01Icon as Clock, 
  CheckmarkCircle02Icon as CheckCircle2, 
  CancelCircleIcon as XCircle,
  Download01Icon as Download,
  AlertCircleIcon as AlertCircle,
  EyeIcon as Eye,
  Film01Icon as Film
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

// Reuse types from page or define shared types
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
  className: string
  icon: React.ReactNode
}> = {
  pending: { 
    label: "Chờ xử lý", 
    color: "text-yellow-600", 
    className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200/20",
    icon: <HugeiconsIcon icon={Clock} className="h-3.5 w-3.5" />
  },
  processing: { 
    label: "Đang thực hiện", 
    color: "text-blue-600",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/20",
    icon: <HugeiconsIcon icon={AlertCircle} className="h-3.5 w-3.5" />
  },
  completed: { 
    label: "Hoàn thành", 
    color: "text-green-600",
    className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200/20",
    icon: <HugeiconsIcon icon={CheckCircle2} className="h-3.5 w-3.5" />
  },
  cancelled: { 
    label: "Đã hủy", 
    color: "text-red-600",
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200/20",
    icon: <HugeiconsIcon icon={XCircle} className="h-3.5 w-3.5" />
  },
}

interface OrderListProps {
  orders: OrderWithService[]
}

export function OrderList({ orders }: OrderListProps) {
  const [filter, setFilter] = React.useState("all")
  const [selectedOrder, setSelectedOrder] = React.useState<OrderWithService | null>(null)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  const filteredOrders = React.useMemo(() => {
    if (filter === "all") return orders
    return orders.filter(order => order.status === filter)
  }, [orders, filter])

  const handleViewOrder = (order: OrderWithService) => {
    setSelectedOrder(order)
    setIsSheetOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-4 sm:w-auto sm:inline-flex bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="all" className="rounded-lg">
              Tất cả
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg">
              Đang xử lý
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg">
              Hoàn thành
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="rounded-lg">
              Đã hủy
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-muted/30">
              <TableHead className="w-[100px]">Mã đơn</TableHead>
              <TableHead>Dịch vụ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Chi phí</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const status = statusConfig[order.status]
                return (
                  <TableRow 
                    key={order.id} 
                    className="cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => handleViewOrder(order)}
                  >
                    <TableCell className="font-medium font-mono text-xs text-muted-foreground">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{order.services.name}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(order.created_at)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={cn("rounded-full border px-2.5 py-0.5 font-normal", status.className)}
                      >
                        <span className="mr-1.5">{status.icon}</span>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatXu(order.total_cost)} Xu
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <HugeiconsIcon icon={Eye} className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  Không tìm thấy đơn hàng nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader className="space-y-4 pb-4 border-b">
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <HugeiconsIcon icon={Film} className="h-5 w-5" />
                  </div>
                  <div>
                    <SheetTitle>{selectedOrder.services.name}</SheetTitle>
                    <SheetDescription className="font-mono text-xs mt-1">
                      ID: {selectedOrder.id}
                    </SheetDescription>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className={cn("rounded-full border px-3 py-1 font-normal", statusConfig[selectedOrder.status].className)}
                  >
                    <span className="mr-1.5">{statusConfig[selectedOrder.status].icon}</span>
                    {statusConfig[selectedOrder.status].label}
                  </Badge>
                  <span className="text-sm font-medium">
                    {formatDate(selectedOrder.created_at)}
                  </span>
                </div>
              </SheetHeader>

              <div className="space-y-6 py-6">
                {/* Cost Section */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-dashed">
                  <span className="text-sm text-muted-foreground">Tổng chi phí</span>
                  <span className="text-lg font-bold text-primary">{formatXu(selectedOrder.total_cost)} Xu</span>
                </div>

                {/* Input Details */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <HugeiconsIcon icon={ShoppingBag} className="h-4 w-4 text-muted-foreground" />
                    Thông tin yêu cầu
                  </h4>
                  <div className="rounded-xl border bg-card text-sm overflow-hidden">
                    {Object.entries(selectedOrder.user_inputs || {}).map(([key, value], index) => (
                      <div key={key} className={cn("flex flex-col p-3 gap-1", index !== 0 && "border-t")}>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-70">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <div className="text-foreground break-words">
                          {typeof value === 'string' && value.startsWith('http') ? (
                            <a 
                              href={value} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              Xem file đính kèm <HugeiconsIcon icon={Download} className="h-3 w-3" />
                            </a>
                          ) : (
                             String(value)
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admin Note */}
                {selectedOrder.admin_note && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <HugeiconsIcon icon={AlertCircle} className="h-4 w-4 text-muted-foreground" />
                      Ghi chú từ Admin
                    </h4>
                    <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 text-sm border border-yellow-200/50 dark:border-yellow-800/30 text-yellow-800 dark:text-yellow-200">
                      {selectedOrder.admin_note}
                    </div>
                  </div>
                )}

                {/* Processing Message */}
                {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                   <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-sm border border-blue-200/50 dark:border-blue-800/30 text-blue-800 dark:text-blue-200">
                    <p className="flex items-start gap-2">
                      <HugeiconsIcon icon={Clock} className="h-4 w-4 shrink-0 mt-0.5" />
                      {selectedOrder.status === 'pending' 
                        ? "Đơn hàng đang chờ xử lý. Vui lòng kiên nhẫn đợi Admin duyệt." 
                        : "Admin đang thực hiện video của bạn. Bạn sẽ nhận được thông báo khi hoàn tất."}
                    </p>
                   </div>
                )}
              </div>

              <SheetFooter className="mt-auto border-t pt-4">
                {selectedOrder.status === 'completed' && selectedOrder.admin_output?.result_url ? (
                  <Button className="w-full rounded-full shadow-lg shadow-primary/20" asChild>
                    <a href={selectedOrder.admin_output.result_url} target="_blank" rel="noopener noreferrer">
                      <HugeiconsIcon icon={Download} className="mr-2 h-4 w-4" />
                      Tải Video Kết Quả
                    </a>
                  </Button>
                ) : (
                   <Button variant="outline" className="w-full rounded-full" onClick={() => setIsSheetOpen(false)}>
                     Đóng
                   </Button>
                )}
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
