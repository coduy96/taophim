import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Logo } from "@/components/logo"
import { Navbar } from "@/components/layout/navbar"
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
    src: "/images/avatars/avatar-1.jpg",
    name: "Lan Anh"
  },
  {
    src: "/images/avatars/avatar-2.jpg",
    name: "Minh Tuấn"
  },
  {
    src: "/images/avatars/avatar-3.jpg",
    name: "Thu Hà"
  },
  {
    src: "/images/avatars/avatar-4.jpg",
    name: "Văn Hùng"
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
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors cursor-default">
                <span className="flex h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"></span>
                Nền tảng AI Video #1 Việt Nam
              </div>

              {/* Headings */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                  Biến ý tưởng thành <br />
                  <span className="relative inline-block">
                    <span className="absolute -inset-1 -rotate-1 bg-primary/10 rounded-xl blur-sm" />
                    <span className="relative text-primary">
                      Video AI
                    </span>
                  </span>
                  <br /> trong tích tắc.
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                  Tạo video chuyên nghiệp từ văn bản và hình ảnh.
                  <span className="text-foreground font-medium"> Không cần kỹ năng.</span>
                  <br />
                  Tiết kiệm <span className="text-primary font-bold">90%</span> thời gian và chi phí.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Button size="lg" className="h-16 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 bg-primary hover:bg-primary/90 border-0" asChild>
                  <Link href={user ? "/dashboard/services" : "/register"}>
                    <HugeiconsIcon icon={Wand2} className="mr-2 h-6 w-6" />
                    Tạo video miễn phí
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-16 px-8 text-lg rounded-full border-2 hover:bg-muted/50 hover:text-primary transition-all duration-300 backdrop-blur-sm bg-background/50" asChild>
                  <Link href="#how-it-works">
                    <HugeiconsIcon icon={Play} className="mr-2 h-6 w-6" />
                    Xem demo 1 phút
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
                  <span className="text-muted-foreground">Tin dùng bởi 1000+ creators</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visuals */}
            <div className="relative hidden lg:block h-[650px] w-full perspective-[2000px]">
              {/* Floating Elements Animation */}
              <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg preserve-3d">

                {/* Back Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[80px] -z-10" />

                {/* 1. Main Landscape Video Card */}
                <div className="absolute top-0 left-0 transform -translate-x-16 -translate-y-32 w-[480px] bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-float z-20 hover:scale-[1.02] transition-transform duration-500 ring-1 ring-border/20">
                  {/* Header */}
                  <div className="h-10 bg-muted/30 border-b border-border/50 flex items-center px-4 gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-zinc-300 shadow-sm" />
                      <div className="w-3 h-3 rounded-full bg-zinc-300 shadow-sm" />
                      <div className="w-3 h-3 rounded-full bg-zinc-300 shadow-sm" />
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
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 z-10" />

                    {/* Simulated Waveform/Video Content */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-60 z-20">
                      <div className="w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
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
                <div className="absolute top-20 right-0 transform translate-x-12 translate-y-0 w-[240px] bg-black rounded-[2rem] shadow-2xl overflow-hidden animate-float-delayed z-30 ring-4 ring-black/10 border border-border/20">
                  <div className="relative h-[420px] bg-zinc-900">
                    {/* Image content */}
                    <Image
                      src="/images/landing/short-form-bg.png"
                      alt="Viral Short Form Video"
                      fill
                      className="object-cover opacity-90"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-black/90 z-10" />

                    {/* Overlay Elements */}
                    <div className="absolute top-6 right-6 z-20">
                      <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <HugeiconsIcon icon={Sparkles} className="w-4 h-4 text-primary" />
                      </div>
                    </div>

                    <div className="absolute bottom-8 left-6 right-6 z-20 text-white">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-[10px] font-bold border border-white/10">VIRAL</div>
                        <div className="text-xs opacity-80">Just now</div>
                      </div>
                      <p className="text-sm font-medium leading-snug">Tạo video TikTok triệu view chỉ trong 30 giây! 🚀</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-muted/20 -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Tại sao <span className="text-primary">Taophim</span> khác biệt?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Không chỉ là công cụ, chúng tôi mang đến giải pháp video AI toàn diện
              giúp bạn bứt phá khả năng sáng tạo.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative z-10">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-3xl bg-background border border-border/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <HugeiconsIcon icon={Zap} className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Công nghệ AI Đỉnh Cao</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tích hợp sức mạnh từ những model AI hàng đầu thế giới như Runway Gen-2, Pika Labs và Kling. Chất lượng video 4K sắc nét.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-3xl bg-background border border-border/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <HugeiconsIcon icon={Clock} className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Tốc độ & Tiện lợi</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Hệ thống AI xử lý tự động 24/7 với tốc độ nhanh chóng. Nhận kết quả video 4K chất lượng cao chỉ trong vài giờ.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-3xl bg-background border border-border/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <HugeiconsIcon icon={Shield} className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Bảo mật Tuyệt đối</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Chúng tôi cam kết bảo vệ quyền riêng tư. Dữ liệu gốc và video thành phẩm được mã hóa và tự động xóa sau 7 ngày.
                </p>
              </div>
            </div>

            {/* Feature 4: VietQR */}
            <div className="group relative p-8 rounded-3xl bg-background border border-border/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <HugeiconsIcon icon={QrCode} className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Thanh toán VietQR</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Hỗ trợ nạp Xu tự động 24/7 qua chuyển khoản ngân hàng (VietQR). Quét mã là có Xu ngay lập tức, không cần chờ đợi.
                </p>
              </div>
            </div>

            {/* Feature 5: Xu Never Expires */}
            <div className="group relative p-8 rounded-3xl bg-background border border-border/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <HugeiconsIcon icon={Infinity} className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Xu Không Hết Hạn</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Mua một lần, dùng trọn đời. Số dư Xu của bạn được bảo lưu vĩnh viễn cho đến khi bạn sử dụng dịch vụ.
                </p>
              </div>
            </div>

            {/* Feature 6: No Monthly Sub */}
            <div className="group relative p-8 rounded-3xl bg-background border border-border/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <HugeiconsIcon icon={CreditCard} className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Không Phí Tháng</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Mô hình Pay-as-you-go linh hoạt. Chỉ trả phí cho đúng những gì bạn tạo ra. Không có phí duy trì, không ràng buộc.
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
              Khám phá <span className="text-primary">Thế giới Video AI</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tuyển tập các công cụ tạo video mạnh mẽ nhất. Đơn giản hóa quy trình sáng tạo của bạn chỉ với vài cú click chuột.
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
                        {service.description || "Tạo video chất lượng cao với công nghệ AI tiên tiến nhất hiện nay."}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                      <span className="text-sm font-medium text-primary flex items-center gap-1 group/btn">
                        Bắt đầu ngay
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
              Sáng tạo Video AI <br /> chỉ với <span className="text-primary">3 bước</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Chúng tôi đã tối ưu hóa mọi thứ để bạn có thể tập trung vào ý tưởng.
              Phần kỹ thuật khó khăn đã có AI lo.
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
                <h3 className="text-xl font-bold mb-3">Chọn dịch vụ</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Khám phá kho công cụ đa dạng: từ ghép mặt (Face Swap), biến ảnh thành video, đến tạo video từ văn bản.
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
                <h3 className="text-xl font-bold mb-3">Tải lên & Tùy chỉnh</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload file của bạn (ảnh/video) và nhập mô tả mong muốn. Hệ thống sẽ tự động tính toán chi phí.
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
                <h3 className="text-xl font-bold mb-3">Nhận kết quả</h3>
                <p className="text-muted-foreground leading-relaxed">
                  AI sẽ tự động xử lý và gửi thông báo khi hoàn tất. Video 4K sắc nét sẽ sẵn sàng tải xuống ngay sau khi xử lý xong.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1" asChild>
              <Link href="/register">
                Bắt đầu sáng tạo ngay
                <HugeiconsIcon icon={ArrowRight} className="ml-2 w-4 h-4" />
              </Link>
            </Button>
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
                Nền tảng tạo video AI hàng đầu Việt Nam. Giúp bạn hiện thực hóa ý tưởng chỉ trong vài phút.
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
            <p>© 2024 Taophim. All rights reserved.</p>
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
