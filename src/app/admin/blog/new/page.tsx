import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon as ArrowLeft } from "@hugeicons/core-free-icons"
import { BlogForm } from "@/components/admin/blog-form"

export default async function NewBlogPostPage() {
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

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/blog">
          <HugeiconsIcon icon={ArrowLeft} className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Thêm bài viết mới</CardTitle>
            <CardDescription>
              Tạo bài viết mới cho blog.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BlogForm authorId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
