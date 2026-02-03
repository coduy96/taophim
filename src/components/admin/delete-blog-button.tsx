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

interface DeleteBlogButtonProps {
  postId: string
  postTitle: string
}

export function DeleteBlogButton({ postId, postTitle }: DeleteBlogButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const supabase = createClient()

      const { error } = await supabase
        .from('blog_posts')
        .update({ deleted_at: new Date().toISOString(), is_published: false })
        .eq('id', postId)

      if (error) {
        throw error
      }

      toast.success("Đã xóa bài viết thành công")
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error deleting blog post:", error)
      toast.error("Không thể xóa bài viết. Vui lòng thử lại.")
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
          <AlertDialogTitle>Xóa bài viết?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa bài viết <span className="font-semibold text-foreground">&quot;{postTitle}&quot;</span> không?
            Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn bài viết khỏi hệ thống.
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
              "Xóa bài viết"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
