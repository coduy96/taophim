import { mightBeLoggedIn } from "@/lib/supabase/fast-auth-check"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Navbar } from "@/components/layout/navbar"
import { Suspense } from "react"
import { ServicesSection } from "@/components/landing/services-section"
import { ServicesSkeleton } from "@/components/landing/services-skeleton"

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

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
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

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

// User avatars for social proof - optimized WebP images
const userAvatars = [
  { src: "/images/avatars/avatar-3.webp", name: "Thu Hà" },
  { src: "/images/avatars/avatar-2.webp", name: "Minh Tuấn" },
  { src: "/images/avatars/avatar-4.webp", name: "Văn Hùng" },
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

            {/* Right Column: Visuals */}
            <div className="hidden lg:flex h-full min-h-[600px] w-full items-center justify-center perspective-[2000px]">
              <div className="relative w-[600px] h-[600px] preserve-3d">
                {/* Back Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl -z-10" />

                {/* 1. Main Landscape Video Card */}
                <div className="absolute top-[10%] left-0 w-[450px] bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-float z-20 hover:scale-[1.02] transition-transform duration-500 ring-1 ring-border/20">
                  {/* Header */}
                  <div className="h-10 bg-muted/30 border-b border-border/50 flex items-center px-4 gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-sm" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/80 shadow-sm" />
                      <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-sm" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="aspect-video relative bg-zinc-900 group cursor-pointer overflow-hidden">
                    <Image
                      src="/images/landing/long-form-bg.webp"
                      alt="Giao diện tạo video AI chuyên nghiệp"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 450px"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40 z-10" />

                    {/* Controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                          <PlayIcon className="w-3 h-3 text-black ml-0.5" />
                        </div>
                        <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full w-1/3 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                        </div>
                        <span className="text-xs text-white/80 font-mono">00:04 / 00:10</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Floating Portrait Card */}
                <div className="absolute top-[25%] right-[5%] w-[240px] bg-black rounded-[2rem] shadow-2xl overflow-hidden animate-float-delayed z-30 ring-4 ring-black/5 border border-white/10">
                  <div className="relative h-[420px] bg-zinc-900">
                    {/* Image content */}
                    <Image
                      src="/images/landing/short-form-bg.webp"
                      alt="Video TikTok viral được tạo bởi AI - triệu view chỉ trong vài phút"
                      fill
                      className="object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                      sizes="240px"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-10" />

                    {/* Overlay Elements */}
                    <div className="absolute bottom-6 left-4 right-4 z-20 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="px-2 py-0.5 rounded-full bg-primary/90 text-[10px] font-bold shadow-lg shadow-primary/20">HD</div>
                        <div className="text-[10px] opacity-80 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">Hoàn thành</div>
                      </div>
                      <p className="text-sm font-medium leading-snug text-shadow-sm">Chất lượng cao, sẵn sàng đăng tải</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                Dịch vụ ghép mặt AI và tạo video chất lượng cao hàng đầu Việt Nam.
                Thanh toán QR, không cần thẻ quốc tế. Nhận video trong vài phút.
              </p>
              <div className="flex gap-4">
                {/* Social Icons Placeholder */}
                <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
                  <UsersIcon className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
                  <FilmIcon className="w-4 h-4" />
                </div>
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
                  Ghép mặt AI, biến ảnh thành video, hay video từ text? Xem giá ngay, không có phí ẩn. Biết trước chi phí trước khi đặt.
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
    </>
  )
}
