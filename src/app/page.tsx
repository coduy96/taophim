import { mightBeLoggedIn } from "@/lib/supabase/fast-auth-check"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Navbar } from "@/components/layout/navbar"
import { Suspense } from "react"
import { ServicesSection } from "@/components/landing/services-section"
import { ServicesSkeleton } from "@/components/landing/services-skeleton"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { FAQSection } from "@/components/landing/faq-section"
import { ComparisonSection } from "@/components/landing/comparison-section"
import { VideoDemosSection } from "@/components/landing/video-demos-section"
import { FacebookMessengerChat } from "@/components/facebook-messenger-chat"

// Inline SVG icons for critical above-the-fold rendering (avoids hugeicons bundle)
const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
)

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

const Wand2Icon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8l1.4 1.4M17.8 6.2l1.4-1.4M12.2 6.2l-1.4-1.4M3 21l9-9" />
  </svg>
)

const FilmIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="2" y1="7" x2="7" y2="7" />
    <line x1="2" y1="17" x2="7" y2="17" />
    <line x1="17" y1="17" x2="22" y2="17" />
    <line x1="17" y1="7" x2="22" y2="7" />
  </svg>
)

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

// Social media icons
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

// User avatars for social proof - optimized WebP images
const userAvatars = [
  { src: "/images/avatars/avatar-3.webp", name: "Thu Hà" },
  { src: "/images/avatars/avatar-2.webp", name: "Minh Tuấn" },
  { src: "/images/avatars/avatar-5.png", name: "Ai ăn kèo này?" },
  { src: "/images/avatars/avatar-1.webp", name: "Lan Anh" }
]

export default async function LandingPage() {
  // Fast cookie check - no network call, just checks for auth cookie presence
  const isLoggedIn = await mightBeLoggedIn()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 overflow-hidden bg-background">
        {/* Background Gradients & Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <div className="absolute top-0 right-0 p-[20%] w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-3xl opacity-40 pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-3xl opacity-40 pointer-events-none -translate-x-1/2 translate-y-1/2" />

        {/* Floating Particles (Simulated) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
          <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-primary/20 rounded-full" />
          <div className="absolute top-[40%] right-[20%] w-3 h-3 bg-primary/20 rounded-full" />
          <div className="absolute bottom-[30%] left-[30%] w-2 h-2 bg-primary/20 rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Content */}
            <div className="space-y-10 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors cursor-default mb-4">
                <span className="flex h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] animate-pulse"></span>
                Nền tảng Video AI hàng đầu Việt Nam
              </div>

              {/* Headings */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                  <span className="block">Biến Ý Tưởng</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                    Thành Video AI
                  </span>
                  <span className="block text-4xl md:text-6xl text-foreground/80">Trong Vài Phút</span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                  Giải pháp tạo video chuyên nghiệp cho <span className="text-foreground font-medium">Content Creator, KOL và Doanh nghiệp</span>. Công nghệ AI tiên tiến, chất lượng điện ảnh.
                  <br />
                  <span className="flex items-center gap-2 mt-3 text-sm font-medium text-foreground/80">
                    <ZapIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    Thanh toán nội địa. Hỗ trợ tiếng Việt. Cam kết hoàn tiền.
                  </span>
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 bg-primary hover:bg-primary/90 font-bold" asChild>
                  <Link href={isLoggedIn ? "/dashboard/services" : "/register"}>
                    <Wand2Icon className="mr-2 h-6 w-6" />
                    Bắt Đầu Ngay
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-muted/50 transition-all duration-300 backdrop-blur-sm" asChild>
                  <Link href="#services">
                    <FilmIcon className="mr-2 h-6 w-6" />
                    Khám Phá Dịch Vụ
                  </Link>
                </Button>
              </div>

              {/* Social Proof - Using native img for faster FCP */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center">
                  <div className="flex -space-x-3">
                    {userAvatars.map((user, i) => (
                      <div key={i} className="relative w-10 h-10 rounded-full ring-[3px] ring-background shadow-md overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40">
                        <img
                          src={user.src}
                          alt={user.name}
                          width={40}
                          height={40}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="w-10 h-10 rounded-full border-[3px] border-background bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center text-xs font-bold text-primary shadow-md -ml-3">
                    +1k
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-start gap-1">
                  <div className="flex items-center gap-1 text-primary">
                    <StarIcon className="w-4 h-4" />
                    <StarIcon className="w-4 h-4" />
                    <StarIcon className="w-4 h-4" />
                    <StarIcon className="w-4 h-4" />
                    <StarIcon className="w-4 h-4" />
                    <span className="text-foreground font-bold ml-1">5.0</span>
                  </div>
                  <span className="text-muted-foreground">Được 1,500+ khách hàng tin dùng</span>
                </div>
              </div>
            </div>

            {/* Right Column: Video Demos Carousel - Desktop */}
            <div className="hidden lg:block">
              <VideoDemosSection variant="hero" />
            </div>
          </div>

          {/* Video Demos Carousel - Mobile/Tablet */}
          <div className="lg:hidden mt-12 -mx-4">
            <VideoDemosSection variant="hero" />
          </div>
        </div>
      </section>

      {/* Below-the-fold content - can be streamed in */}
      <Suspense fallback={<BelowFoldSkeleton />}>
        <BelowFoldContent isLoggedIn={isLoggedIn} />
      </Suspense>

      {/* Footer */}
      <footer className="border-t bg-slate-50 dark:bg-black/20 pt-16 pb-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-md">
            {/* Brand */}
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2.5">
                <Logo className="w-9 h-9" width={36} height={36} />
                <span className="font-bold text-xl tracking-tight">Taophim</span>
              </Link>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Dịch vụ tạo video AI chất lượng điện ảnh hàng đầu Việt Nam.
                Thanh toán QR, không cần thẻ quốc tế. Nhận video trong vài phút.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61573590554545"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-background border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://www.tiktok.com/@taophimaichonguoiviet"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-9 h-9 rounded-full bg-background border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <TiktokIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://www.youtube.com/@T%E1%BA%A1oPhimAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full bg-background border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Taophim. Tạo phim AI chất lượng cao tại Việt Nam.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Chính sách bảo mật</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Điều khoản sử dụng</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Facebook Messenger Chat - Only on landing page */}
      <FacebookMessengerChat />
    </div>
  )
}

// Skeleton for below-fold content
function BelowFoldSkeleton() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="h-8 w-64 bg-muted rounded mx-auto mb-8 animate-pulse" />
        <div className="h-4 w-96 bg-muted rounded mx-auto mb-16 animate-pulse" />
        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-muted rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

// Below-the-fold content - loaded after initial paint
async function BelowFoldContent({ isLoggedIn }: { isLoggedIn: boolean }) {
  // Dynamic imports for icons used below the fold
  const { HugeiconsIcon } = await import("@hugeicons/react")
  const icons = await import("@hugeicons/core-free-icons")

  return (
    <>
      {/* Features Section */}
      <section id="features" className="py-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-muted/20 -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Vì sao <span className="text-primary">1,500+ khách hàng</span> chọn Taophim?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Chúng tôi giải quyết mọi rào cản để bạn có video chất lượng cao mà không cần học edit, không cần mua subscription đắt đỏ.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative z-10">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-3xl bg-background border border-border/50 overflow-hidden hover:border-primary/50 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <HugeiconsIcon icon={icons.FlashIcon} className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Công Nghệ AI Tiên Tiến Nhất</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sử dụng các model AI hàng đầu thế giới. Tạo video <strong>chất lượng cao, chuyển động mượt mà</strong> - hiệu ứng mà các app miễn phí không thể làm được.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-3xl bg-background border border-border/50 overflow-hidden hover:border-primary/50 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <HugeiconsIcon icon={icons.Time01Icon} className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Có Video Trong Thời Gian Ngắn</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Thay vì thuê freelancer mất 3-5 ngày, Taophim trả kết quả cực nhanh. Phù hợp để bắt trend TikTok, Reels ngay lập tức.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-3xl bg-background border border-border/50 overflow-hidden hover:border-primary/50 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <HugeiconsIcon icon={icons.Shield01Icon} className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Bảo Mật & Riêng Tư</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Source ảnh và video của bạn được mã hóa và tự động xóa sau 7 ngày. Cam kết không sử dụng dữ liệu của khách hàng cho mục đích training AI.
                </p>
              </div>
            </div>

            {/* Feature 4: QR */}
            <div className="group relative p-8 rounded-3xl bg-background border border-border/50 overflow-hidden hover:border-primary/50 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <HugeiconsIcon icon={icons.QrCodeIcon} className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Thanh Toán QR Tiện Lợi</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Không cần thẻ Visa/Mastercard. Quét mã QR ngân hàng Việt Nam, Xu cộng ngay lập tức. Nạp bao nhiêu dùng bấy nhiêu.
                </p>
              </div>
            </div>

            {/* Feature 5: Xu Never Expires */}
            <div className="group relative p-8 rounded-3xl bg-background border border-border/50 overflow-hidden hover:border-primary/50 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <HugeiconsIcon icon={icons.InfinityIcon} className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Xu Bảo Lưu Vĩnh Viễn</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Không ép dùng hết trong tháng. Nạp 1 lần dùng cả đời. Xu của bạn luôn ở đó cho đến khi bạn sử dụng dịch vụ.
                </p>
              </div>
            </div>

            {/* Feature 6: No Monthly Sub */}
            <div className="group relative p-8 rounded-3xl bg-background border border-border/50 overflow-hidden hover:border-primary/50 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <HugeiconsIcon icon={icons.CreditCardIcon} className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Rẻ Hơn 90% So Với Mua Acc</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Không tốn $30-$90/tháng để mua tài khoản Premium của các công cụ AI. Tại Taophim, bạn chỉ trả đúng giá trị video bạn tạo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-muted/30 relative">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Dịch Vụ Video AI <span className="text-primary">Hot Nhất</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Bắt trend TikTok, Reels, YouTube Shorts cực dễ dàng.
              <br className="hidden md:block" />
              <span className="text-foreground font-medium">Chọn dịch vụ, xem giá ngay bên dưới.</span>
            </p>
          </div>

          <Suspense fallback={<ServicesSkeleton />}>
            <ServicesSection isLoggedIn={isLoggedIn} />
          </Suspense>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-background relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Có Video Đẹp <br /> Chỉ Sau <span className="text-primary">3 Bước Đơn Giản</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Không cần cài phần mềm. Không cần học edit. Không cần chờ đợi lâu.
              <br />
              <span className="text-foreground font-medium">Bạn lo ý tưởng, Taophim lo phần còn lại.</span>
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative max-w-6xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent border-t border-dashed border-primary/30 z-0" />

            {/* Step 1 */}
            <div className="relative z-10 group">
              <div className="bg-background rounded-3xl p-8 border border-border/50 overflow-hidden h-full flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full" />
                  <div className="w-12 h-12 text-primary font-bold text-2xl flex items-center justify-center">01</div>
                </div>
                <h3 className="text-xl font-bold mb-3">Chọn Dịch Vụ Phù Hợp</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ảnh thành Video, Thay đổi nhân vật, hay Tạo Video từ Văn Bản? Xem giá ngay, không có phí ẩn. Biết trước chi phí trước khi đặt.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 group">
              <div className="bg-background rounded-3xl p-8 border border-border/50 overflow-hidden h-full flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full" />
                  <div className="w-12 h-12 text-primary font-bold text-2xl flex items-center justify-center">02</div>
                </div>
                <h3 className="text-xl font-bold mb-3">Gửi Ảnh & Mô Tả</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload ảnh/video của bạn, viết vài dòng mô tả mong muốn. Xu sẽ được giữ tạm thời.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 group">
              <div className="bg-background rounded-3xl p-8 border border-border/50 overflow-hidden h-full flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full" />
                  <div className="w-12 h-12 text-primary font-bold text-2xl flex items-center justify-center">03</div>
                </div>
                <h3 className="text-xl font-bold mb-3">Nhận Video - Xong!</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Chờ vài phút là có thông báo. Tải video chất lượng cao về máy. Đăng TikTok, Reels, YouTube Shorts - tuỳ bạn!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1" asChild>
              <Link href="/register">
                Thử Ngay - Đăng Ký Miễn Phí
                <ArrowRightIcon className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Comparison Section */}
      <ComparisonSection />

      {/* FAQ Section */}
      <FAQSection />
    </>
  )
}
