import type { Metadata } from "next"
import Link from "next/link"
import { Logo } from "@/components/logo"

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description: "Chính sách bảo mật của Taophim. Tìm hiểu cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Chính sách bảo mật | Taophim",
    description: "Chính sách bảo mật của Taophim - Nền tảng tạo video AI hàng đầu Việt Nam.",
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8 rounded-lg" width={32} height={32} />
            <span className="font-semibold text-lg">Taophim</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <article className="prose prose-zinc dark:prose-invert max-w-none">
            <h1>Chính sách bảo mật</h1>
            <p className="lead">
              Cập nhật lần cuối: Tháng 1, 2025
            </p>

            <h2>1. Giới thiệu</h2>
            <p>
              Chào mừng bạn đến với Taophim (&ldquo;chúng tôi&rdquo;, &ldquo;của chúng tôi&rdquo;). Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ thông tin của bạn khi bạn sử dụng dịch vụ tạo video AI của chúng tôi.
            </p>

            <h2>2. Thông tin chúng tôi thu thập</h2>
            <h3>2.1. Thông tin bạn cung cấp</h3>
            <ul>
              <li><strong>Thông tin tài khoản:</strong> Họ tên, địa chỉ email khi đăng ký.</li>
              <li><strong>Nội dung tải lên:</strong> Ảnh, video bạn tải lên để sử dụng dịch vụ.</li>
              <li><strong>Thông tin thanh toán:</strong> Lịch sử giao dịch, số dư Xu.</li>
            </ul>

            <h3>2.2. Thông tin tự động thu thập</h3>
            <ul>
              <li>Địa chỉ IP, loại trình duyệt, thiết bị.</li>
              <li>Thời gian truy cập, trang đã xem.</li>
              <li>Dữ liệu sử dụng dịch vụ.</li>
            </ul>

            <h2>3. Cách chúng tôi sử dụng thông tin</h2>
            <ul>
              <li>Cung cấp và cải thiện dịch vụ tạo video AI.</li>
              <li>Xử lý thanh toán và quản lý tài khoản.</li>
              <li>Liên hệ hỗ trợ và thông báo quan trọng.</li>
              <li>Phân tích để cải thiện trải nghiệm người dùng.</li>
            </ul>

            <h2>4. Bảo mật dữ liệu</h2>
            <p>
              Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ thông tin của bạn:
            </p>
            <ul>
              <li>Mã hóa dữ liệu khi truyền tải (SSL/TLS).</li>
              <li>Ảnh và video tải lên được tự động xóa sau 7 ngày.</li>
              <li>Không sử dụng dữ liệu của bạn để huấn luyện AI.</li>
              <li>Kiểm soát truy cập nghiêm ngặt.</li>
            </ul>

            <h2>5. Chia sẻ thông tin</h2>
            <p>
              Chúng tôi không bán thông tin cá nhân của bạn. Chúng tôi chỉ chia sẻ thông tin trong các trường hợp:
            </p>
            <ul>
              <li>Với sự đồng ý của bạn.</li>
              <li>Để tuân thủ nghĩa vụ pháp lý.</li>
              <li>Với đối tác cung cấp dịch vụ (thanh toán, hosting) theo hợp đồng bảo mật.</li>
            </ul>

            <h2>6. Quyền của bạn</h2>
            <p>Bạn có quyền:</p>
            <ul>
              <li>Truy cập và xem thông tin cá nhân của bạn.</li>
              <li>Yêu cầu chỉnh sửa thông tin không chính xác.</li>
              <li>Yêu cầu xóa tài khoản và dữ liệu.</li>
              <li>Rút lại sự đồng ý bất cứ lúc nào.</li>
            </ul>

            <h2>7. Cookie</h2>
            <p>
              Chúng tôi sử dụng cookie để cải thiện trải nghiệm người dùng, bao gồm cookie phiên đăng nhập và cookie phân tích. Bạn có thể quản lý cài đặt cookie trong trình duyệt.
            </p>

            <h2>8. Thay đổi chính sách</h2>
            <p>
              Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Chúng tôi sẽ thông báo về các thay đổi quan trọng qua email hoặc thông báo trên website.
            </p>

            <h2>9. Liên hệ</h2>
            <p>
              Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ:
            </p>
            <ul>
              <li>Email: support@taophim.com</li>
              <li>Website: taophim.com</li>
            </ul>
          </article>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 Taophim. Nền tảng tạo video AI hàng đầu Việt Nam.
        </div>
      </footer>
    </div>
  )
}
