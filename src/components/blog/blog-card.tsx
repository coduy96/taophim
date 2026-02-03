import Link from "next/link"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Image01Icon as ImageIcon,
  Calendar03Icon as Calendar,
  ArrowRight01Icon as ArrowRight
} from "@hugeicons/core-free-icons"

interface BlogCardProps {
  slug: string
  title: string
  excerpt: string | null
  coverImage: string | null
  publishedAt: string | null
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function BlogCard({ slug, title, excerpt, coverImage, publishedAt }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="h-full rounded-2xl border border-border/50 bg-background overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
        {/* Cover Image */}
        <div className="aspect-[16/9] relative overflow-hidden bg-muted">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
              <HugeiconsIcon icon={ImageIcon} className="w-12 h-12 text-primary/30" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Date */}
          {publishedAt && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <HugeiconsIcon icon={Calendar} className="h-4 w-4" />
              <span>{formatDate(publishedAt)}</span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {excerpt}
            </p>
          )}

          {/* Read More */}
          <div className="pt-1">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Đọc thêm
              <HugeiconsIcon icon={ArrowRight} className="h-4 w-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
