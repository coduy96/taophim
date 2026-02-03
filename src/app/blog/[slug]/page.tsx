import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { mightBeLoggedIn } from "@/lib/supabase/fast-auth-check"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon as ArrowLeft,
  ArrowRight01Icon as ArrowRight,
  Calendar03Icon as Calendar,
  UserIcon as User,
  Image01Icon as ImageIcon,
  Home01Icon as Home
} from "@hugeicons/core-free-icons"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://taophim.com'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, meta_title, meta_description, cover_image')
    .eq('slug', slug)
    .eq('is_published', true)
    .is('deleted_at', null)
    .single()

  if (!post) {
    return {
      title: "Bài viết không tồn tại | Taophim",
    }
  }

  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt || `Đọc bài viết "${post.title}" tại Taophim - Nền tảng tạo video AI hàng đầu Việt Nam.`

  return {
    title: `${title} | Taophim`,
    description,
    openGraph: {
      title: `${title} | Taophim`,
      description,
      type: 'article',
      url: `${BASE_URL}/blog/${slug}`,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Taophim`,
      description,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
    alternates: {
      canonical: `${BASE_URL}/blog/${slug}`,
    },
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function formatDateISO(dateString: string): string {
  return new Date(dateString).toISOString()
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const isLoggedIn = await mightBeLoggedIn()

  // Fetch blog post with author info
  const { data: post } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:profiles(full_name, avatar_url)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .is('deleted_at', null)
    .single()

  if (!post) {
    notFound()
  }

  // JSON-LD Structured Data
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt || post.title,
    image: post.cover_image || undefined,
    datePublished: post.published_at ? formatDateISO(post.published_at) : formatDateISO(post.created_at),
    dateModified: formatDateISO(post.updated_at),
    author: {
      '@type': 'Person',
      name: post.author?.full_name || 'Taophim',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Taophim',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${slug}`,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${BASE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${BASE_URL}/blog/${slug}`,
      },
    ],
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen flex flex-col bg-background">
        {/* Hero Header */}
        <section className="relative pt-8 pb-8 md:pt-12 md:pb-12 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-3xl opacity-40 pointer-events-none translate-x-1/2 -translate-y-1/2" />

          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                <HugeiconsIcon icon={Home} className="h-4 w-4" />
                <span>Trang chủ</span>
              </Link>
              <HugeiconsIcon icon={ArrowRight} className="h-3 w-3" />
              <Link href="/blog" className="hover:text-primary transition-colors">
                Blog
              </Link>
              <HugeiconsIcon icon={ArrowRight} className="h-3 w-3" />
              <span className="text-foreground font-medium line-clamp-1 max-w-[200px]">{post.title}</span>
            </nav>

            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <header className="text-center mb-8">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
                  {post.author?.full_name && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <HugeiconsIcon icon={User} className="h-4 w-4 text-primary" />
                      </div>
                      <span>{post.author.full_name}</span>
                    </div>
                  )}
                  {post.published_at && (
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={Calendar} className="h-4 w-4" />
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                  {post.title}
                </h1>
              </header>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Cover Image */}
              {post.cover_image ? (
                <div className="aspect-video relative rounded-3xl overflow-hidden mb-12 shadow-2xl ring-1 ring-border/10">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-video relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-br from-primary/10 via-primary/5 to-purple-500/10 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <HugeiconsIcon icon={ImageIcon} className="w-12 h-12 text-primary/30" />
                  </div>
                </div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <div className="mb-12 p-6 md:p-8 rounded-2xl bg-muted/50 border border-border/50">
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic">
                    {post.excerpt}
                  </p>
                </div>
              )}

              {/* Content */}
              <div
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                  prose-p:leading-relaxed prose-p:text-foreground/90
                  prose-a:text-primary prose-a:underline prose-a:underline-offset-4
                  prose-img:rounded-2xl prose-img:shadow-lg
                  prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
                  prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary
                  prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Footer */}
              <footer className="mt-16 pt-8 border-t border-border/50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Button variant="outline" asChild className="rounded-full px-6">
                    <Link href="/blog">
                      <HugeiconsIcon icon={ArrowLeft} className="mr-2 h-4 w-4" />
                      Xem thêm bài viết
                    </Link>
                  </Button>
                  <Button asChild className="rounded-full px-6 shadow-lg shadow-primary/20">
                    <Link href={isLoggedIn ? "/dashboard/services" : "/register"}>
                      {isLoggedIn ? "Tạo Video Ngay" : "Đăng Ký Miễn Phí"}
                      <HugeiconsIcon icon={ArrowRight} className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </footer>
            </div>
          </div>
        </article>
      </div>
    </>
  )
}
