import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Logo } from "@/components/logo"
import { Navbar } from "@/components/layout/navbar"
import { LogoCloud } from "@/components/landing/logo-cloud"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SparklesIcon as Sparkles,
  ArrowRight01Icon as ArrowRight,
  PlayIcon as Play,
  FlashIcon as Zap,
  Shield01Icon as Shield,
  Time01Icon as Clock,
  UserGroupIcon as Users,
  Coins01Icon as Coins,
  MagicWand01Icon as Wand2,
  StarIcon as Star,
  Film01Icon as Film,
  QrCodeIcon as QrCode,
  InfinityIcon as Infinity,
  CreditCardIcon as CreditCard
} from "@hugeicons/core-free-icons"

// User avatars for social proof - local images
const userAvatars = [
  {
    src: "/images/avatars/avatar-3.png",
    name: "Thu Hà"
  },
  {
    src: "/images/avatars/avatar-2.png",
    name: "Minh Tuấn"
  },
  {
    src: "/images/avatars/avatar-4.png",
    name: "Văn Hùng"
  }, {
    src: "/images/avatars/avatar-1.png",
    name: "Lan Anh"
  }
]

function formatXu(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

interface Service {
  id: string
  slug: string
  name: string
  description: string | null
  base_cost: number
  cover_image: string | null
}

export default async function LandingPage() {
  const supabase = await createClient()

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch active services
  const { data: services } = await supabase
    .from('services')
    .select('id, slug, name, description, base_cost, cover_image')
    .eq('is_active', true)
    .limit(6)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 overflow-hidden bg-background">
        {/* Background Gradients & Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <div className="absolute top-0 right-0 p-[20%] w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-[120px] opacity-40 pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-[120px] opacity-40 pointer-events-none -translate-x-1/2 translate-y-1/2" />

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
                Đã phục vụ 1,500+ khách hàng tại Việt Nam 🇻🇳
              </div>

              {/* Headings */}
              <div className="space-y-6">

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                  Tạo Video AI <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                    Triệu View
                  </span>
                  <br />
                  <span className="text-4xl md:text-6xl text-foreground/80">Chỉ Từ 10K.</span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                  Tích hợp công nghệ <span className="text-foreground font-medium">Google VEO, Runway, Pika, Kling</span> đắt đỏ nhất thế giới - với giá rẻ cho người Việt.
                  <br />
                  <span className="flex items-center gap-2 mt-3 text-sm font-medium text-foreground/80">
                    <HugeiconsIcon icon={Zap} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    Không cần biết edit. Không cần tiếng Anh.
                  </span>
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 bg-primary hover:bg-primary/90 font-bold" asChild>
                  <Link href={user ? "/dashboard/services" : "/register"}>
                    <HugeiconsIcon icon={Wand2} className="mr-2 h-6 w-6" />
                    Thử Ngay Miễn Phí
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-muted/50 transition-all duration-300 backdrop-blur-sm" asChild>
                  <Link href="#services">
                    <HugeiconsIcon icon={Film} className="mr-2 h-6 w-6" />
                    Xem Mẫu Video
                  </Link>
                </Button>
              </div>

              {/* Social Proof */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center">
                  <AvatarGroup className="-space-x-3">
                    {userAvatars.map((user, i) => (
                      <Avatar key={i} size="lg" className="ring-[3px] ring-background shadow-md hover:scale-110 hover:z-10 transition-transform duration-200">
                        <AvatarImage src={user.src} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-medium">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  <div className="w-10 h-10 rounded-full border-[3px] border-background bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center text-xs font-bold text-primary shadow-md -ml-3">
                    +1k
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-start gap-1">
                  <div className="flex items-center gap-1 text-primary">
                    <HugeiconsIcon icon={Star} className="w-4 h-4 fill-current" />
                    <HugeiconsIcon icon={Star} className="w-4 h-4 fill-current" />
                    <HugeiconsIcon icon={Star} className="w-4 h-4 fill-current" />
                    <HugeiconsIcon icon={Star} className="w-4 h-4 fill-current" />
                    <HugeiconsIcon icon={Star} className="w-4 h-4 fill-current" />
                    <span className="text-foreground font-bold ml-1">5.0</span>
                  </div>
                  <span className="text-muted-foreground">Được TikToker & KOL tin dùng</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visuals */}
            <div className="hidden lg:flex h-full min-h-[600px] w-full items-center justify-center perspective-[2000px]">
              <div className="relative w-[600px] h-[600px] preserve-3d">
                {/* Back Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse-slow" />

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
                      src="/images/landing/long-form-bg.png"
                      alt="AI Video Editor Interface"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={100}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40 z-10" />

                    {/* Controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                          <HugeiconsIcon icon={Play} className="w-3 h-3 text-black fill-black ml-0.5" />
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
                      src="/images/landing/short-form-bg.png"
                      alt="Viral Short Form Video"
                      fill
                      className="object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-10" />

                    {/* Overlay Elements */}

                    <div className="absolute bottom-6 left-4 right-4 z-20 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="px-2 py-0.5 rounded-full bg-primary/90 text-[10px] font-bold shadow-lg shadow-primary/20">VIRAL</div>
                        <div className="text-[10px] opacity-80 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">Vừa xong</div>
                      </div>
                      <p className="text-sm font-medium leading-snug text-shadow-sm">Video triệu view chỉ trong 2 giờ!</p>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Trusted By / Logo Cloud */}
      <LogoCloud />

      {/* Features Section */}
      <section id="features" className="py-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-muted/20 -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />

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
                  <HugeiconsIcon icon={Zap} className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Công Nghệ AI Số 1 Thế Giới</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tích hợp các model AI đắt đỏ như <strong>Google VEO, Runway, Pika, Kling</strong>. Tạo video 4K sắc nét, chuyển động mượt mà mà các app miễn phí không làm được.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-3xl bg-background border border-border/50 overflow-hidden hover:border-primary/50 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <HugeiconsIcon icon={Clock} className="h-7 w-7 text-primary" />
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
                  <HugeiconsIcon icon={Shield} className="h-7 w-7 text-primary" />
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
                  <HugeiconsIcon icon={QrCode} className="h-7 w-7 text-primary" />
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
                  <HugeiconsIcon icon={Infinity} className="h-7 w-7 text-primary" />
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
                  <HugeiconsIcon icon={CreditCard} className="h-7 w-7 text-primary" />
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

          {services && services.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service: Service) => (
                <Link
                  href={user ? `/dashboard/services/${service.slug}` : "/register"}
                  key={service.id}
                  className="group relative flex flex-col h-full bg-background border border-border/50 rounded-3xl overflow-hidden"
                >
                  {/* Image/Preview Area */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-muted">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Image */}
                    {service.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={service.cover_image}
                        alt={service.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                        <HugeiconsIcon icon={Film} className="w-12 h-12 text-primary/20" />
                      </div>
                    )}

                    {/* Floating Price Tag */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                        <HugeiconsIcon icon={Coins} className="w-3.5 h-3.5 text-yellow-400" />
                        <span>{formatXu(service.base_cost)} Xu</span>
                      </div>
                    </div>

                    {/* Play Button Overlay (Hover) */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                      <div className="w-14 h-14 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 backdrop-blur-sm">
                        <HugeiconsIcon icon={Play} className="w-6 h-6 ml-1 fill-current" />
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex flex-col flex-grow p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {service.name}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                        {service.description || "Tạo video chất lượng 4K với công nghệ AI tiên tiến nhất. Gửi ảnh, nhận video trong vài giờ."}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                      <span className="text-sm font-medium text-primary flex items-center gap-1 group/btn">
                        Đặt Đơn Ngay
                        <HugeiconsIcon icon={ArrowRight} className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <HugeiconsIcon icon={Star} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span>4.9/5.0</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <HugeiconsIcon icon={Wand2} className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Đang cập nhật dịch vụ</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Chúng tôi đang nỗ lực bổ sung các dịch vụ mới nhất. Vui lòng quay lại sau!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-background relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10" />

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
                  Upload ảnh/video của bạn, viết vài dòng mô tả mong muốn. Xu sẽ được giữ tạm thời, chỉ trừ khi bạn hài lòng với kết quả.
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
                <h3 className="text-xl font-bold mb-3">Nhận Video 4K - Xong!</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Chờ vài giờ là có thông báo. Tải video 4K sắc nét về máy. Đăng TikTok, Reels, YouTube Shorts - tuỳ bạn!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1" asChild>
              <Link href="/register">
                Thử Ngay - Đăng Ký Miễn Phí
                <HugeiconsIcon icon={ArrowRight} className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">Không cần thẻ tín dụng.</p>
          </div>
        </div>
      </section>

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
                Dịch vụ ghép mặt AI và tạo video chất lượng 4K hàng đầu Việt Nam.
                Thanh toán QR, không cần thẻ quốc tế. Nhận video trong vài giờ.
              </p>
              <div className="flex gap-4">
                {/* Social Icons Placeholder */}
                <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
                  <HugeiconsIcon icon={Users} className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
                  <HugeiconsIcon icon={Film} className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2025 Taophim. Ghép mặt AI, tạo video AI chất lượng cao tại Việt Nam.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Chính sách bảo mật</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Điều khoản sử dụng</Link>
            </div>
          </div>
        </div>
      </footer>
    </div >
  )
}
