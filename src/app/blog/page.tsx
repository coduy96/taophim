import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { BlogCard } from "@/components/blog/blog-card"
import { Navbar } from "@/components/layout/navbar"
import { mightBeLoggedIn } from "@/lib/supabase/fast-auth-check"
import { HugeiconsIcon } from "@hugeicons/react"
import { TextIcon as Text, ArrowRight01Icon as ArrowRight, ArrowLeft01Icon as ArrowLeft } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Blog | Taophim - Nền tảng tạo video AI",
  description: "Khám phá các bài viết hướng dẫn, mẹo và tin tức mới nhất về công nghệ tạo video AI tại Taophim.",
  openGraph: {
    title: "Blog | Taophim",
    description: "Khám phá các bài viết hướng dẫn, mẹo và tin tức mới nhất về công nghệ tạo video AI tại Taophim.",
  },
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
  published_at: string | null
}

const POSTS_PER_PAGE = 9

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const isLoggedIn = await mightBeLoggedIn()

  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page || '1', 10))
  const offset = (currentPage - 1) * POSTS_PER_PAGE

  // Get total count for pagination
  const { count: totalCount } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)
    .is('deleted_at', null)

  const totalPages = Math.ceil((totalCount || 0) / POSTS_PER_PAGE)

  // Fetch published blog posts with pagination
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image, published_at')
    .eq('is_published', true)
    .is('deleted_at', null)
    .order('published_at', { ascending: false })
    .range(offset, offset + POSTS_PER_PAGE - 1)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={isLoggedIn} />


      {/* Blog Posts Section */}
      <section className="py-16 md:py-24 bg-muted/30 flex-1 relative">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

        <div className="container mx-auto px-4 relative z-10">
          {posts && posts.length > 0 ? (
            <>
              {/* Section Title */}
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Bài Viết <span className="text-primary">Mới Nhất</span>
                </h2>
                <p className="text-muted-foreground">
                  {totalCount} bài viết được cập nhật
                </p>
              </div>

              {/* Blog Posts Grid */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                {posts.map((post: BlogPost) => (
                  <BlogCard
                    key={post.id}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    coverImage={post.cover_image}
                    publishedAt={post.published_at}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {currentPage > 1 ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      asChild
                    >
                      <Link href={`/blog?page=${currentPage - 1}`}>
                        <HugeiconsIcon icon={ArrowLeft} className="h-4 w-4 mr-1" />
                        Trước
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      disabled
                    >
                      <HugeiconsIcon icon={ArrowLeft} className="h-4 w-4 mr-1" />
                      Trước
                    </Button>
                  )}

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1

                      if (!showPage) {
                        // Show ellipsis for gaps
                        if (page === 2 && currentPage > 3) {
                          return <span key={page} className="px-2 text-muted-foreground">...</span>
                        }
                        if (page === totalPages - 1 && currentPage < totalPages - 2) {
                          return <span key={page} className="px-2 text-muted-foreground">...</span>
                        }
                        return null
                      }

                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          className="rounded-full w-9 h-9 p-0"
                          asChild={page !== currentPage}
                        >
                          {page !== currentPage ? (
                            <Link href={`/blog?page=${page}`}>{page}</Link>
                          ) : (
                            <span>{page}</span>
                          )}
                        </Button>
                      )
                    })}
                  </div>

                  {currentPage < totalPages ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      asChild
                    >
                      <Link href={`/blog?page=${currentPage + 1}`}>
                        Sau
                        <HugeiconsIcon icon={ArrowRight} className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      disabled
                    >
                      Sau
                      <HugeiconsIcon icon={ArrowRight} className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              )}

              {/* Page info */}
              {totalPages > 1 && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Trang {currentPage} / {totalPages}
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <HugeiconsIcon icon={Text} className="w-12 h-12 text-muted-foreground/50" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Chưa có bài viết nào</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Các bài viết mới sẽ sớm được cập nhật. Hãy quay lại sau hoặc khám phá các dịch vụ của chúng tôi!
              </p>
              <Button asChild className="rounded-full px-8">
                <Link href="/#services">
                  Khám phá dịch vụ
                  <HugeiconsIcon icon={ArrowRight} className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">
            Sẵn sàng tạo video AI?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Đăng ký miễn phí và bắt đầu tạo video chất lượng cao ngay hôm nay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" asChild>
              <Link href={isLoggedIn ? "/dashboard/services" : "/register"}>
                {isLoggedIn ? "Tạo Video Ngay" : "Đăng Ký Miễn Phí"}
                <HugeiconsIcon icon={ArrowRight} className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
              <Link href="/#services">
                Xem Dịch Vụ
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
