"use client"

import { cn } from "@/lib/utils"

// Star icon for ratings
const StarIcon = ({ className, filled = true }: { className?: string; filled?: boolean }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

// Quote icon
const QuoteIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
)

interface Testimonial {
  id: number
  name: string
  role: string
  avatar: string
  rating: number
  quote: string
  service: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Minh Tuấn",
    role: "Content Director",
    avatar: "/images/avatars/avatar-2.webp",
    rating: 5,
    quote: "Từ khi dùng Taophim, mình làm video nhanh gấp 10 lần. Video thay đổi nhân vật chất lượng cao, khán giả tưởng mình quay thật. Doanh thu tháng này tăng 300%!",
    service: "Thay đổi nhân vật"
  },
  {
    id: 2,
    name: "Thu Hà",
    role: "Chủ shop online",
    avatar: "/images/avatars/avatar-3.webp",
    rating: 5,
    quote: "Trước mình phải thuê freelancer 500k/video, giờ chỉ vài chục nghìn là có video quảng cáo sản phẩm đẹp lung linh từ ảnh. Tiết kiệm được cả triệu mỗi tháng.",
    service: "Ảnh thành Video"
  },
  {
    id: 3,
    name: "Ai ăn kèo này?",
    role: "TikToker",
    avatar: "/images/avatars/avatar-5.png",
    rating: 5,
    quote: "Chỉ cần viết mô tả ý tưởng là có video đẹp xuất sắc. Thanh toán QR siêu tiện, không cần thẻ quốc tế. Team support nhiệt tình, inbox là được giải quyết ngay.",
    service: "Tạo Video từ Văn Bản"
  },
  {
    id: 4,
    name: "Lan Anh",
    role: "Marketing Manager",
    avatar: "/images/avatars/avatar-1.webp",
    rating: 5,
    quote: "Công ty mình dùng Taophim để tạo video marketing từ ảnh sản phẩm. Chất lượng điện ảnh mà giá rẻ hơn nhiều so với mua subscription Runway hay Pika.",
    service: "Ảnh thành Video"
  }
]

function TestimonialCard({ testimonial, className }: { testimonial: Testimonial; className?: string }) {
  return (
    <div className={cn(
      "group relative p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
      className
    )}>
      {/* Quote icon */}
      <QuoteIcon className="absolute top-4 right-4 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />

      {/* Rating */}
      <div className="flex items-center gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={cn(
              "w-4 h-4",
              i < testimonial.rating ? "text-yellow-400" : "text-muted-foreground/30"
            )}
            filled={i < testimonial.rating}
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-foreground/90 leading-relaxed mb-6 text-sm">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/10 bg-gradient-to-br from-primary/20 to-primary/40">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground truncate">{testimonial.role}</p>
        </div>
        <div className="px-2.5 py-1 bg-primary/10 rounded-full">
          <span className="text-xs font-medium text-primary">{testimonial.service}</span>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <StarIcon className="w-4 h-4 text-yellow-400" />
            Được tin dùng bởi 1,500+ khách hàng
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Khách Hàng <span className="text-primary">Nói Gì</span> Về Taophim?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hàng nghìn Content Creator, KOL, và Doanh nghiệp đã tin tưởng sử dụng dịch vụ của chúng tôi.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary mb-2">1,500+</p>
            <p className="text-sm text-muted-foreground">Khách hàng</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary mb-2">10,000+</p>
            <p className="text-sm text-muted-foreground">Video đã tạo</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary mb-2">5.0</p>
            <p className="text-sm text-muted-foreground">Đánh giá trung bình</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary mb-2">98%</p>
            <p className="text-sm text-muted-foreground">Hài lòng</p>
          </div>
        </div>
      </div>
    </section>
  )
}
