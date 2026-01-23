"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  CheckmarkCircle02Icon as CheckCircle2, 
  CancelCircleIcon as XCircle, 
  PlayIcon as Play, 
  Upload01Icon as Upload 
} from "@hugeicons/core-free-icons"
import { createClient } from "@/lib/supabase/client"

interface OrderActionFormProps {
  orderId: string
  currentStatus: string
}

export function OrderActionForm({ orderId, currentStatus }: OrderActionFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [action, setAction] = useState<'start' | 'complete' | 'cancel' | null>(null)
  const [resultFile, setResultFile] = useState<File | null>(null)
  const [adminNote, setAdminNote] = useState("")

  const handleStartProcessing = async () => {
    setIsLoading(true)
    setAction('start')

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('orders')
        .update({ status: 'processing', updated_at: new Date().toISOString() })
        .eq('id', orderId)

      if (error) throw error

      toast.success("Đã bắt đầu xử lý đơn hàng")
      router.refresh()
    } catch (error) {
      toast.error("Có lỗi xảy ra")
      console.error(error)
    } finally {
      setIsLoading(false)
      setAction(null)
    }
  }

  const handleComplete = async () => {
    if (!resultFile) {
      toast.error("Vui lòng tải lên file kết quả")
      return
    }

    setIsLoading(true)
    setAction('complete')

    try {
      const supabase = createClient()

      // Upload result file
      const fileExt = resultFile.name.split('.').pop()
      const fileName = `output/${orderId}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('order-assets')
        .upload(fileName, resultFile)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('order-assets')
        .getPublicUrl(fileName)

      // Complete order using RPC
      const { error } = await supabase.rpc('complete_order', {
        p_order_id: orderId,
        p_admin_output: { result_url: publicUrl }
      })

      if (error) throw error

      // Update admin note if provided
      if (adminNote) {
        await supabase
          .from('orders')
          .update({ admin_note: adminNote })
          .eq('id', orderId)
      }

      toast.success("Đơn hàng đã hoàn thành!")
      router.push('/admin/orders')
      router.refresh()
    } catch (error) {
      toast.error("Có lỗi xảy ra khi hoàn thành đơn hàng")
      console.error(error)
    } finally {
      setIsLoading(false)
      setAction(null)
    }
  }

  const handleCancel = async () => {
    if (!adminNote) {
      toast.error("Vui lòng nhập lý do hủy đơn")
      return
    }

    setIsLoading(true)
    setAction('cancel')

    try {
      const supabase = createClient()

      // Cancel order using RPC (this will refund the frozen Xu)
      const { error } = await supabase.rpc('cancel_order', {
        p_order_id: orderId,
        p_admin_note: adminNote
      })

      if (error) throw error

      toast.success("Đơn hàng đã bị hủy và hoàn Xu cho khách")
      router.push('/admin/orders')
      router.refresh()
    } catch (error) {
      toast.error("Có lỗi xảy ra khi hủy đơn hàng")
      console.error(error)
    } finally {
      setIsLoading(false)
      setAction(null)
    }
  }

  return (
    <div className="space-y-4">
      {currentStatus === 'pending' && (
        <Button 
          className="w-full" 
          onClick={handleStartProcessing}
          disabled={isLoading}
        >
          {isLoading && action === 'start' ? (
            <Spinner className="mr-2 h-4 w-4" />
          ) : (
            <HugeiconsIcon icon={Play} className="mr-2 h-4 w-4" />
          )}
          Bắt đầu xử lý
        </Button>
      )}

      {(currentStatus === 'pending' || currentStatus === 'processing') && (
        <>
          <div className="space-y-2">
            <Label>File kết quả</Label>
            <div className="relative border-2 border-dashed rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <input
                type="file"
                accept="video/*,image/*"
                onChange={(e) => setResultFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading}
              />
              {resultFile ? (
                <div className="flex items-center justify-center gap-2 min-w-0 overflow-hidden max-w-full">
                  <HugeiconsIcon icon={CheckCircle2} className="h-5 w-5 text-green-500 shrink-0" />
                  <span className="font-medium truncate min-w-0">{resultFile.name}</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <HugeiconsIcon icon={Upload} className="h-6 w-6 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click để tải lên kết quả
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ghi chú (tùy chọn / bắt buộc khi hủy)</Label>
            <Textarea
              placeholder="Nhập ghi chú cho khách hàng..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              onClick={handleComplete}
              disabled={isLoading || !resultFile}
            >
              {isLoading && action === 'complete' ? (
                <Spinner className="mr-2 h-4 w-4" />
              ) : (
                <HugeiconsIcon icon={CheckCircle2} className="mr-2 h-4 w-4" />
              )}
              Hoàn thành
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {isLoading && action === 'cancel' ? (
                <Spinner className="mr-2 h-4 w-4" />
              ) : (
                <HugeiconsIcon icon={XCircle} className="mr-2 h-4 w-4" />
              )}
              Hủy đơn
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
