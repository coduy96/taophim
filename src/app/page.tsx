import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Sparkles,
  ArrowRight,
  Play,
  Zap,
  Shield,
  Clock,
  Users,
  Star,
  CheckCircle2,
  Coins
} from "lucide-react"

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
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-9 h-9" width={36} height={36} />
            <span className="font-bold text-xl">Taophim</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="#services"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden md:block"
            >
              Dịch vụ
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden md:block"
            >
              Cách hoạt động
            </Link>
            <ModeToggle />
            {user ? (
              <Button asChild>
                <Link href="/dashboard">
                  Vào Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">
                    Đăng ký miễn phí
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/30 bg-primary/5">
              <Zap className="mr-2 h-3.5 w-3.5 text-primary" />
              Nền tảng AI Video #1 Việt Nam
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Tạo video AI{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                chuyên nghiệp
              </span>
              <br />
              chỉ trong vài phút
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ghép mặt, tạo video từ ảnh, và nhiều hơn nữa với công nghệ AI tiên tiến.
              Không cần kỹ năng chỉnh sửa video.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 shadow-lg shadow-primary/20" asChild>
                <Link href={user ? "/dashboard/services" : "/register"}>
                  <Play className="mr-2 h-5 w-5" />
                  Bắt đầu ngay
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link href="#services">
                  Xem dịch vụ
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Bảo mật tuyệt đối</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Xử lý trong 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span>1000+ khách hàng</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tại sao chọn Taophim?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chúng tôi mang đến trải nghiệm tạo video AI đơn giản và chất lượng cao nhất
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Công nghệ AI tiên tiến</CardTitle>
                <CardDescription>
                  Sử dụng các model AI mới nhất từ Runway, Pika, Kling để đảm bảo chất lượng video tốt nhất.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Xử lý nhanh chóng</CardTitle>
                <CardDescription>
                  Đội ngũ của chúng tôi cam kết xử lý đơn hàng trong vòng 24 giờ hoặc hoàn tiền.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle>An toàn & Bảo mật</CardTitle>
                <CardDescription>
                  Dữ liệu của bạn được bảo vệ tuyệt đối. Chúng tôi xóa file sau 7 ngày.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Dịch vụ của chúng tôi</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Khám phá các dịch vụ AI Video</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chọn dịch vụ phù hợp với nhu cầu của bạn
            </p>
          </div>

          {services && services.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service: Service) => (
                <Card
                  key={service.id}
                  className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video relative bg-gradient-to-br from-primary/20 to-primary/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-12 w-12 text-primary/30 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-primary text-primary-foreground">
                        <Coins className="mr-1 h-3 w-3" />
                        {formatXu(service.base_cost)} Xu
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {service.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {service.description || "Dịch vụ tạo video AI chuyên nghiệp"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" asChild>
                      <Link href={user ? `/dashboard/services/${service.slug}` : "/register"}>
                        Sử dụng ngay
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Các dịch vụ đang được cập nhật...</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Quy trình đơn giản</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cách hoạt động</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chỉ với 3 bước đơn giản, bạn sẽ có video AI chất lượng cao
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Chọn dịch vụ</h3>
              <p className="text-muted-foreground">
                Chọn loại video bạn muốn tạo: ghép mặt, tạo video từ ảnh, v.v.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Tải lên file</h3>
              <p className="text-muted-foreground">
                Upload ảnh hoặc video của bạn và điền thông tin yêu cầu.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Nhận kết quả</h3>
              <p className="text-muted-foreground">
                Đợi trong 24h và tải xuống video AI chất lượng cao của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing hint */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl">Hệ thống Xu đơn giản</CardTitle>
              <CardDescription className="text-base">
                Nạp Xu một lần, sử dụng nhiều dịch vụ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3 text-center">
                <div className="p-4 rounded-lg bg-background/80">
                  <div className="text-2xl font-bold text-primary">1.000đ</div>
                  <div className="text-sm text-muted-foreground">= 1 Xu</div>
                </div>
                <div className="p-4 rounded-lg bg-background/80">
                  <div className="text-2xl font-bold text-primary">Từ 50 Xu</div>
                  <div className="text-sm text-muted-foreground">/video</div>
                </div>
                <div className="p-4 rounded-lg bg-background/80">
                  <div className="text-2xl font-bold text-green-600">Hoàn tiền</div>
                  <div className="text-sm text-muted-foreground">nếu không hài lòng</div>
                </div>
              </div>
              <div className="text-center pt-4">
                <Button size="lg" asChild>
                  <Link href={user ? "/dashboard" : "/register"}>
                    <Star className="mr-2 h-5 w-5" />
                    Bắt đầu miễn phí
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8" width={32} height={32} />
              <span className="font-semibold">Taophim</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2024 Taophim. Nền tảng tạo video AI hàng đầu Việt Nam.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/login" className="hover:text-foreground transition-colors">
                Đăng nhập
              </Link>
              <Link href="/register" className="hover:text-foreground transition-colors">
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
