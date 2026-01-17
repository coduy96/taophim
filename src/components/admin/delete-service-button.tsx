"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon as Trash } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DeleteServiceButtonProps {
  serviceId: string
  serviceName: string
}

export function DeleteServiceButton({ serviceId, serviceName }: DeleteServiceButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const supabase = createClient()
      
      const { error } = await supabase
        .from('services')
        .update({ deleted_at: new Date().toISOString(), is_active: false })
        .eq('id', serviceId)

      if (error) {
        throw error
      }

      toast.success("Đã xóa dịch vụ thành công")
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error deleting service:", error)
      toast.error("Không thể xóa dịch vụ. Vui lòng thử lại.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10">
          <HugeiconsIcon icon={Trash} className="mr-2 h-4 w-4" />
          Xóa
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa dịch vụ?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa dịch vụ <span className="font-semibold text-foreground">&quot;{serviceName}&quot;</span> không? 
            Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn dịch vụ khỏi hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Đang xóa...
              </>
            ) : (
              "Xóa dịch vụ"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
