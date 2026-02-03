import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PlusSignIcon as Plus,
  TextIcon as Text,
  Edit02Icon as Edit,
  Image01Icon as ImageIcon
} from "@hugeicons/core-free-icons"
import Image from "next/image"
import { DeleteBlogButton } from "@/components/admin/delete-blog-button"

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
}

export default async function AdminBlogPage() {
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

  // Fetch all blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image, is_published, published_at, created_at')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <HugeiconsIcon icon={Text} className="h-6 w-6 text-primary" />
            </div>
            Quản lý bài viết
          </h1>
          <p className="text-muted-foreground mt-2">
            Thêm, sửa, xóa các bài viết trên blog.
          </p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/admin/blog/new">
            <HugeiconsIcon icon={Plus} className="mr-2 h-4 w-4" />
            Thêm bài viết
          </Link>
        </Button>
      </div>

      {/* Blog Posts List */}
      {posts && posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: BlogPost) => (
            <Card key={post.id} className="group">
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

              {/* Cover */}
              <div className="aspect-[16/10] relative overflow-hidden rounded-t-3xl">
                {post.cover_image ? (
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                    <HugeiconsIcon icon={ImageIcon} className="w-12 h-12 text-primary/20" />
                  </div>
                )}
                <div className="absolute top-4 right-4 z-10">
                  <Badge
                    variant={post.is_published ? "default" : "secondary"}
                    className="rounded-full px-3"
                  >
                    {post.is_published ? "Đã xuất bản" : "Nháp"}
                  </Badge>
                </div>
              </div>
              <CardHeader className="relative pb-2">
                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {post.excerpt || "Không có tóm tắt"}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Slug:</span>
                  <code className="text-xs bg-muted px-2 py-0.5 rounded-full truncate max-w-[150px]">{post.slug}</code>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ngày tạo:</span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
                {post.published_at && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Xuất bản:</span>
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 rounded-full" asChild>
                    <Link href={`/admin/blog/${post.id}`}>
                      <HugeiconsIcon icon={Edit} className="mr-2 h-4 w-4" />
                      Sửa
                    </Link>
                  </Button>
                  <DeleteBlogButton postId={post.id} postTitle={post.title} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border/50">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <HugeiconsIcon icon={Text} className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Chưa có bài viết nào</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-4">
            Tạo bài viết đầu tiên để chia sẻ nội dung với người dùng.
          </p>
          <Button asChild className="rounded-full">
            <Link href="/admin/blog/new">
              <HugeiconsIcon icon={Plus} className="mr-2 h-4 w-4" />
              Thêm bài viết
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
