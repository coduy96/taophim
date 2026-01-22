"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
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
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ShoppingBag01Icon as ShoppingBag, 
  Time01Icon as Clock, 
  CheckmarkCircle02Icon as CheckCircle2, 
  CancelCircleIcon as XCircle,
  Download01Icon as Download,
  AlertCircleIcon as AlertCircle,
  EyeIcon as Eye,
  Film01Icon as Film,
  Copy01Icon as Copy,
  Image01Icon as ImageIcon,
  PlayCircle02Icon as PlayCircle,
  ArrowRight01Icon as ArrowRight,
  Tick01Icon as Check,
  MessageEdit01Icon as MessageEdit,
  CalendarCheckIn01Icon as Calendar,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Download file helper - opens URL directly for streaming download
function downloadFile(url: string, filename?: string) {
  // Extract filename from URL if not provided
  const defaultFilename = url.split('/').pop()?.split('?')[0] || 'download'
  const downloadFilename = filename || defaultFilename

  // Create a temporary link and trigger download
  // This opens the file directly, allowing the browser to stream it
  // instead of loading the entire file into memory first
  const link = document.createElement('a')
  link.href = url
  link.download = downloadFilename
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toast.success("Đang tải xuống...", { id: "download" })
}

// Reuse types from page or define shared types
interface FormField {
  id: string
  label: string
  type: string
}
interface FormConfig {
  fields: FormField[]
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
    form_config: FormConfig | null
    cover_image: string | null
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
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  })
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Vừa xong"
  if (diffMins < 60) return `${diffMins} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  if (diffDays < 7) return `${diffDays} ngày trước`
  return formatDate(dateString)
}

const statusConfig: Record<string, { 
  label: string
  color: string
  className: string
  icon: React.ReactNode
  step: number
}> = {
  pending: { 
    label: "Chờ xử lý", 
    color: "text-yellow-600", 
    className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200/20",
    icon: <HugeiconsIcon icon={Clock} className="h-3.5 w-3.5" />,
    step: 1
  },
  processing: { 
    label: "Đang thực hiện", 
    color: "text-blue-600",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/20",
    icon: <HugeiconsIcon icon={AlertCircle} className="h-3.5 w-3.5" />,
    step: 2
  },
  completed: { 
    label: "Hoàn thành", 
    color: "text-green-600",
    className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200/20",
    icon: <HugeiconsIcon icon={CheckCircle2} className="h-3.5 w-3.5" />,
    step: 3
  },
  cancelled: { 
    label: "Đã hủy", 
    color: "text-red-600",
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200/20",
    icon: <HugeiconsIcon icon={XCircle} className="h-3.5 w-3.5" />,
    step: -1
  },
}

// Helper to detect file type from URL
function getFileType(url: string): 'image' | 'video' | 'unknown' {
  const lower = url.toLowerCase()
  if (lower.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/)) return 'image'
  if (lower.match(/\.(mp4|webm|mov|avi|mkv|m4v)(\?|$)/)) return 'video'
  return 'unknown'
}

function getOrderPreview(order: OrderWithService) {
  // 1. Try to find input image/video
  const inputs = order.user_inputs || {}
  for (const value of Object.values(inputs)) {
    if (typeof value === 'string') {
      const type = getFileType(value)
      if (type !== 'unknown') {
        return { url: value, type }
      }
    }
  }

  // 2. Fallback to service cover image
  if (order.services.cover_image) {
    return { url: order.services.cover_image, type: 'image' as const }
  }

  return null
}

function getOrderSummary(order: OrderWithService) {
  const inputs = order.user_inputs || {}
  // Find first text input that isn't a URL
  for (const value of Object.values(inputs)) {
    if (typeof value === 'string' && getFileType(value) === 'unknown' && value.length > 0) {
      // Truncate if too long
      return value.length > 60 ? value.substring(0, 60) + '...' : value
    }
  }
  return null
}

// File Preview Component
function FilePreview({ url, label }: { url: string; label: string }) {
  const fileType = getFileType(url)
  const [isExpanded, setIsExpanded] = React.useState(false)

  if (fileType === 'image') {
    return (
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-70">
          {label}
        </span>
        <div 
          className={cn(
            "relative rounded-xl overflow-hidden border bg-muted/30 cursor-pointer transition-all duration-300",
            isExpanded ? "max-h-96" : "max-h-32"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Image 
            src={url} 
            alt={label}
            width={400}
            height={300}
            className="w-full h-full object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
            <span className="text-white text-xs font-medium">
              {isExpanded ? "Thu nhỏ" : "Phóng to"}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            downloadFile(url)
          }}
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          <HugeiconsIcon icon={Download} className="h-3 w-3" />
          Tải về
        </button>
      </div>
    )
  }

  if (fileType === 'video') {
    return (
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-70">
          {label}
        </span>
        <div className="relative rounded-xl overflow-hidden border bg-muted/30">
          <video 
            src={url}
            className="w-full max-h-40 object-cover"
            controls={false}
            muted
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="h-12 w-12 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <HugeiconsIcon icon={PlayCircle} className="h-6 w-6 text-primary" />
            </a>
          </div>
        </div>
        <button
          onClick={() => downloadFile(url)}
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          <HugeiconsIcon icon={Download} className="h-3 w-3" />
          Tải về
        </button>
      </div>
    )
  }

  // Fallback for unknown file types
  return (
    <div className="space-y-2">
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-70">
        {label}
      </span>
      <button
        onClick={() => downloadFile(url)}
        className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors w-full text-left"
      >
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <HugeiconsIcon icon={Download} className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">File đính kèm</p>
          <p className="text-xs text-muted-foreground">Nhấn để tải về</p>
        </div>
        <HugeiconsIcon icon={ArrowRight} className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  )
}

// Order Progress Timeline
function OrderTimeline({ status, createdAt, updatedAt }: { 
  status: string
  createdAt: string
  updatedAt: string
}) {
  const currentStep = statusConfig[status]?.step ?? 0
  const isCancelled = status === 'cancelled'

  const steps = [
    { 
      label: "Đã đặt hàng", 
      description: "Đơn hàng đã được tạo",
      step: 1,
      icon: ShoppingBag
    },
    { 
      label: "Đang xử lý", 
      description: "AI đang tạo video",
      step: 2,
      icon: Clock
    },
    { 
      label: "Hoàn thành", 
      description: "Video đã sẵn sàng",
      step: 3,
      icon: CheckCircle2
    },
  ]

  if (isCancelled) {
    return (
      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <HugeiconsIcon icon={XCircle} className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="font-medium text-red-700 dark:text-red-300">Đơn hàng đã bị hủy</p>
            <p className="text-sm text-red-600/70 dark:text-red-400/70">
              Xu đã được hoàn lại vào ví của bạn
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-start">
        {steps.map((step, index) => {
          const isCompleted = currentStep >= step.step
          const isCurrent = currentStep === step.step
          const isLast = index === steps.length - 1

          return (
            <div key={step.step} className="flex-1 relative">
              <div className="flex flex-col items-center">
                {/* Step indicator */}
                <div 
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center z-10 transition-all duration-300",
                    isCompleted 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                      : "bg-muted border-2 border-muted-foreground/20 text-muted-foreground",
                    isCurrent && "ring-4 ring-primary/20"
                  )}
                >
                  {isCompleted && !isCurrent ? (
                    <HugeiconsIcon icon={Check} className="h-5 w-5" />
                  ) : (
                    <HugeiconsIcon icon={step.icon} className="h-4 w-4" />
                  )}
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <p className={cn(
                    "text-xs font-medium",
                    isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {step.step === 1 ? formatRelativeTime(createdAt) : formatRelativeTime(updatedAt)}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2">
                  <div 
                    className={cn(
                      "h-full transition-all duration-500",
                      currentStep > step.step 
                        ? "bg-primary" 
                        : "bg-muted-foreground/20"
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Result Preview Component
function ResultPreview({ url }: { url: string }) {
  const fileType = getFileType(url)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  if (fileType === 'video') {
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-green-500/10 flex items-center justify-center">
            <HugeiconsIcon icon={Film} className="h-3.5 w-3.5 text-green-600" />
          </div>
          Video kết quả
        </h4>
        <div className="relative rounded-2xl overflow-hidden bg-black/90 border shadow-xl">
          <video 
            ref={videoRef}
            src={url}
            className="w-full aspect-video object-contain"
            controls
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          {!isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-transparent to-black/20 cursor-pointer"
              onClick={handlePlayPause}
            >
              <div className="h-16 w-16 rounded-full bg-white/95 dark:bg-white/90 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                <HugeiconsIcon icon={PlayCircle} className="h-8 w-8 text-primary ml-1" />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (fileType === 'image') {
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-green-500/10 flex items-center justify-center">
            <HugeiconsIcon icon={ImageIcon} className="h-3.5 w-3.5 text-green-600" />
          </div>
          Ảnh kết quả
        </h4>
        <div className="relative rounded-2xl overflow-hidden border shadow-xl">
          <Image 
            src={url}
            alt="Kết quả"
            width={600}
            height={400}
            className="w-full object-cover"
            unoptimized
          />
        </div>
      </div>
    )
  }

  // Fallback
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <div className="h-6 w-6 rounded-lg bg-green-500/10 flex items-center justify-center">
          <HugeiconsIcon icon={Download} className="h-3.5 w-3.5 text-green-600" />
        </div>
        Kết quả
      </h4>
      <div className="p-4 rounded-xl border bg-muted/30">
        <p className="text-sm text-muted-foreground">
          File kết quả đã sẵn sàng để tải về
        </p>
      </div>
    </div>
  )
}

interface OrderListProps {
  orders: OrderWithService[]
  initialOrderId?: string
  currentFilter?: string
}

export function OrderList({ orders, initialOrderId, currentFilter = "all" }: OrderListProps) {
  const [selectedOrder, setSelectedOrder] = React.useState<OrderWithService | null>(null)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  const [copiedId, setCopiedId] = React.useState(false)

  // Note: Real-time updates are handled by NotificationBell component
  // which triggers router.refresh() when new notifications arrive
  // This avoids duplicate subscriptions and reduces Supabase real-time costs

  // Auto-open sheet if initialOrderId is provided
  React.useEffect(() => {
    if (initialOrderId) {
      const order = orders.find(o => o.id === initialOrderId)
      if (order) {
        setSelectedOrder(order)
        setIsSheetOpen(true)
      }
    }
  }, [initialOrderId, orders])

  // Update selected order when orders prop changes (real-time update)
  React.useEffect(() => {
    if (selectedOrder) {
      const updatedOrder = orders.find(o => o.id === selectedOrder.id)
      if (updatedOrder && JSON.stringify(updatedOrder) !== JSON.stringify(selectedOrder)) {
        setSelectedOrder(updatedOrder)
      }
    }
  }, [orders, selectedOrder])

  // Orders are now already filtered server-side, just use directly
  const filteredOrders = orders

  const handleViewOrder = (order: OrderWithService) => {
    setSelectedOrder(order)
    setIsSheetOpen(true)
    setCopiedId(false)
  }

  const handleCopyOrderId = async () => {
    if (selectedOrder) {
      await navigator.clipboard.writeText(selectedOrder.id)
      setCopiedId(true)
      toast.success("Đã sao chép mã đơn hàng")
      setTimeout(() => setCopiedId(false), 2000)
    }
  }

  // Helper function to get field label from form_config by ID
  const getFieldLabel = (fieldId: string, formConfig: FormConfig | null): string => {
    if (!formConfig?.fields) return fieldId.replace(/_/g, ' ')
    const field = formConfig.fields.find(f => f.id === fieldId)
    return field?.label || fieldId.replace(/_/g, ' ')
  }

  // Separate file inputs from text inputs
  const getInputsByType = (inputs: Record<string, unknown>, formConfig: FormConfig | null) => {
    const files: { key: string; label: string; url: string }[] = []
    const texts: { key: string; label: string; value: string }[] = []

    Object.entries(inputs || {}).forEach(([key, value]) => {
      const label = getFieldLabel(key, formConfig)
      if (typeof value === 'string' && value.startsWith('http')) {
        files.push({ key, label, url: value })
      } else if (value !== null && value !== undefined) {
        texts.push({ key, label, value: String(value) })
      }
    })

    return { files, texts }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs value={currentFilter} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-4 sm:w-auto sm:inline-flex bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="all" className="rounded-lg" asChild>
              <Link href="/dashboard/orders?status=all">Tất cả</Link>
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg" asChild>
              <Link href="/dashboard/orders?status=pending">Đang xử lý</Link>
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg" asChild>
              <Link href="/dashboard/orders?status=completed">Hoàn thành</Link>
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="rounded-lg" asChild>
              <Link href="/dashboard/orders?status=cancelled">Đã hủy</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-muted/30">
              <TableHead className="w-[100px] hidden sm:table-cell">Mã đơn</TableHead>
              <TableHead>Thông tin dịch vụ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Chi phí</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const status = statusConfig[order.status]
                const preview = getOrderPreview(order)
                const summary = getOrderSummary(order)

                return (
                  <TableRow 
                    key={order.id} 
                    className="cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => handleViewOrder(order)}
                  >
                    <TableCell className="font-medium font-mono text-xs text-muted-foreground hidden sm:table-cell">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        {/* Thumbnail */}
                        <div className="h-12 w-12 shrink-0 rounded-lg bg-muted border overflow-hidden relative">
                          {preview ? (
                            preview.type === 'video' ? (
                              <video 
                                src={preview.url} 
                                className="h-full w-full object-cover" 
                                muted 
                                loop 
                                playsInline
                              />
                            ) : (
                              <Image 
                                src={preview.url} 
                                alt={order.services.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            )
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                              <HugeiconsIcon icon={Film} className="h-5 w-5 opacity-20" />
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="font-medium truncate">{order.services.name}</span>
                          {summary && (
                            <p className="text-xs text-muted-foreground line-clamp-1 italic">
                              &ldquo;{summary}&rdquo;
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-0.5 sm:hidden">
                            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1 rounded">
                              #{order.id.slice(0, 8)}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {formatDate(order.created_at)}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground hidden sm:inline-block">
                            {formatDate(order.created_at)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={cn("rounded-full border px-2.5 py-0.5 font-normal whitespace-nowrap", status.className)}
                      >
                        <span className="mr-1.5">{status.icon}</span>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium whitespace-nowrap">
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
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
          {selectedOrder && (
            <>
              {/* Header Section */}
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
                <SheetHeader className="p-6 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shadow-inner">
                        <HugeiconsIcon icon={Film} className="h-6 w-6" />
                      </div>
                      <div>
                        <SheetTitle className="text-lg">{selectedOrder.services.name}</SheetTitle>
                        <SheetDescription className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded-md">
                            #{selectedOrder.id.slice(0, 8)}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={handleCopyOrderId}
                          >
                            <HugeiconsIcon 
                              icon={copiedId ? Check : Copy} 
                              className={cn("h-3.5 w-3.5", copiedId && "text-green-600")} 
                            />
                          </Button>
                        </SheetDescription>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={cn("rounded-full border px-3 py-1.5 font-normal", statusConfig[selectedOrder.status].className)}
                    >
                      <span className="mr-1.5">{statusConfig[selectedOrder.status].icon}</span>
                      {statusConfig[selectedOrder.status].label}
                    </Badge>
                  </div>
                </SheetHeader>
              </div>

              <div className="p-6 space-y-6">
                {/* Result Preview - Show first for completed orders */}
                {selectedOrder.status === 'completed' && selectedOrder.admin_output?.result_url && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <ResultPreview url={selectedOrder.admin_output.result_url} />
                  </div>
                )}

                {/* Order Timeline */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center">
                      <HugeiconsIcon icon={Clock} className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    Tiến độ đơn hàng
                  </h4>
                  <div className="p-4 rounded-xl border bg-card">
                    <OrderTimeline 
                      status={selectedOrder.status} 
                      createdAt={selectedOrder.created_at}
                      updatedAt={selectedOrder.updated_at}
                    />
                  </div>
                </div>

                <Separator />

                {/* Cost & Date Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <HugeiconsIcon icon={ShoppingBag} className="h-4 w-4" />
                      <span className="text-xs font-medium">Chi phí</span>
                    </div>
                    <span className="text-xl font-bold text-primary">
                      {formatXu(selectedOrder.total_cost)} Xu
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <HugeiconsIcon icon={Calendar} className="h-4 w-4" />
                      <span className="text-xs font-medium">Ngày tạo</span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatDate(selectedOrder.created_at)}
                    </span>
                  </div>
                </div>

                {/* User Inputs Section */}
                {(() => {
                  const { files, texts } = getInputsByType(selectedOrder.user_inputs, selectedOrder.services.form_config)
                  
                  if (files.length === 0 && texts.length === 0) return null

                  return (
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center">
                          <HugeiconsIcon icon={MessageEdit} className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        Thông tin yêu cầu
                      </h4>
                      
                      {/* Text inputs */}
                      {texts.length > 0 && (
                        <div className="rounded-xl border bg-card overflow-hidden">
                          {texts.map(({ key, label, value }, index) => (
                            <div key={key} className={cn("p-4", index !== 0 && "border-t")}>
                              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-70 block mb-1">
                                {label}
                              </span>
                              <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* File inputs with previews */}
                      {files.length > 0 && (
                        <div className="space-y-4">
                          {files.map(({ key, label, url }) => (
                            <FilePreview key={key} url={url} label={label} />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })()}

                {/* Admin Note */}
                {selectedOrder.admin_note && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                        <HugeiconsIcon icon={AlertCircle} className="h-3.5 w-3.5 text-yellow-600" />
                      </div>
                      Ghi chú từ Hệ thống
                    </h4>
                    <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 text-sm border border-yellow-200/50 dark:border-yellow-800/30">
                      <p className="text-yellow-800 dark:text-yellow-200 whitespace-pre-wrap">
                        {selectedOrder.admin_note}
                      </p>
                    </div>
                  </div>
                )}

                {/* Processing Message */}
                {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-sm border border-blue-200/50 dark:border-blue-800/30">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <HugeiconsIcon icon={Clock} className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-200">
                          {selectedOrder.status === 'pending' 
                            ? "Đơn hàng đang chờ xử lý" 
                            : "AI đang tạo video của bạn"}
                        </p>
                        <p className="text-blue-700/70 dark:text-blue-300/70 mt-1">
                          {selectedOrder.status === 'pending' 
                            ? "Hệ thống AI đang xếp hàng yêu cầu của bạn. Thời gian xử lý thường từ 1-24 giờ." 
                            : "Hệ thống AI đang xử lý video của bạn. Bạn sẽ nhận được thông báo khi hoàn tất."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <SheetFooter className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t p-6">
                {selectedOrder.status === 'completed' && selectedOrder.admin_output?.result_url ? (
                  <Button
                    className="w-full rounded-full shadow-lg shadow-primary/20 h-12 text-base"
                    onClick={() => downloadFile(selectedOrder.admin_output!.result_url!)}
                  >
                    <HugeiconsIcon icon={Download} className="mr-2 h-5 w-5" />
                    Tải Video Kết Quả
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full rounded-full h-12" onClick={() => setIsSheetOpen(false)}>
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
