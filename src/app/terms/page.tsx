import type { Metadata } from "next"
import Link from "next/link"
import { Logo } from "@/components/logo"

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  description: "Điều khoản sử dụng của Taophim. Tìm hiểu các quy định khi sử dụng dịch vụ tạo video AI của chúng tôi.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Điều khoản sử dụng | Taophim",
    description: "Điều khoản sử dụng của Taophim - Nền tảng tạo video AI hàng đầu Việt Nam.",
  },
}

export default function TermsPage() {
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
            <h1>Điều khoản sử dụng</h1>
            <p className="lead">
              Cập nhật lần cuối: Tháng 1, 2025
            </p>

            <h2>1. Chấp nhận điều khoản</h2>
            <p>
              Bằng việc truy cập và sử dụng dịch vụ Taophim, bạn đồng ý tuân thủ các điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của chúng tôi.
            </p>

            <h2>2. Mô tả dịch vụ</h2>
            <p>
              Taophim cung cấp dịch vụ tạo video AI bao gồm:
            </p>
            <ul>
              <li>Ảnh thành Video: Chuyển đổi ảnh thành video chất lượng điện ảnh với chuyển động mượt mà</li>
              <li>Thay đổi nhân vật: Thay đổi nhân vật từ video tham chiếu sang nhân vật trong ảnh</li>
              <li>Tạo Video từ Văn Bản: Tạo video chất lượng điện ảnh từ mô tả văn bản</li>
            </ul>

            <h2>3. Tài khoản người dùng</h2>
            <h3>3.1. Đăng ký tài khoản</h3>
            <ul>
              <li>Bạn phải cung cấp thông tin chính xác khi đăng ký.</li>
              <li>Bạn phải từ 18 tuổi trở lên để sử dụng dịch vụ.</li>
              <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập.</li>
            </ul>

            <h3>3.2. Trách nhiệm tài khoản</h3>
            <p>
              Bạn chịu trách nhiệm với mọi hoạt động diễn ra trên tài khoản của mình. Thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép.
            </p>

            <h2>4. Hệ thống Xu và thanh toán</h2>
            <h3>4.1. Nạp Xu</h3>
            <ul>
              <li>Xu được nạp qua các phương thức thanh toán được hỗ trợ (VietQR, ngân hàng).</li>
              <li>Xu không có thời hạn sử dụng.</li>
              <li>Xu không được chuyển nhượng giữa các tài khoản.</li>
            </ul>

            <h3>4.2. Sử dụng Xu</h3>
            <ul>
              <li>Xu được trừ khi đơn hàng hoàn thành.</li>
              <li>Xu được tạm giữ khi tạo đơn hàng.</li>
              <li>Xu được hoàn trả 100% nếu đơn hàng bị hủy.</li>
            </ul>

            <h3>4.3. Hoàn tiền</h3>
            <p>
              Chúng tôi không hoàn tiền Xu đã nạp. Tuy nhiên, nếu có lỗi từ hệ thống, chúng tôi sẽ xem xét từng trường hợp cụ thể.
            </p>

            <h2>5. Nội dung người dùng</h2>
            <h3>5.1. Quyền sở hữu</h3>
            <p>
              Bạn giữ quyền sở hữu nội dung bạn tải lên. Bằng việc tải lên, bạn cấp cho chúng tôi quyền sử dụng nội dung đó để cung cấp dịch vụ.
            </p>

            <h3>5.2. Nội dung bị cấm</h3>
            <p>Bạn không được tải lên hoặc tạo nội dung:</p>
            <ul>
              <li>Vi phạm pháp luật Việt Nam.</li>
              <li>Xâm phạm quyền của bên thứ ba.</li>
              <li>Khiêu dâm, bạo lực, hoặc gây hại.</li>
              <li>Giả mạo danh tính người khác mà không có sự đồng ý.</li>
              <li>Lừa đảo hoặc thông tin sai lệch.</li>
            </ul>

            <h3>5.3. Xử lý vi phạm</h3>
            <p>
              Chúng tôi có quyền xóa nội dung vi phạm và khóa tài khoản mà không cần thông báo trước.
            </p>

            <h2>6. Quyền sở hữu trí tuệ</h2>
            <p>
              Taophim và các nhãn hiệu, logo, nội dung liên quan thuộc sở hữu của chúng tôi. Bạn không được sao chép, phân phối hoặc sử dụng mà không có sự cho phép.
            </p>

            <h2>7. Giới hạn trách nhiệm</h2>
            <ul>
              <li>Dịch vụ được cung cấp &ldquo;nguyên trạng&rdquo; (as is).</li>
              <li>Chúng tôi không đảm bảo dịch vụ hoạt động liên tục, không có lỗi.</li>
              <li>Chúng tôi không chịu trách nhiệm về thiệt hại gián tiếp.</li>
              <li>Trách nhiệm tối đa của chúng tôi giới hạn ở số tiền bạn đã thanh toán.</li>
            </ul>

            <h2>8. Thay đổi dịch vụ</h2>
            <p>
              Chúng tôi có quyền thay đổi, tạm ngưng hoặc ngừng cung cấp dịch vụ bất cứ lúc nào. Chúng tôi sẽ cố gắng thông báo trước khi có thay đổi lớn.
            </p>

            <h2>9. Chấm dứt</h2>
            <p>
              Chúng tôi có quyền chấm dứt tài khoản của bạn nếu vi phạm điều khoản này. Bạn có thể yêu cầu xóa tài khoản bất cứ lúc nào.
            </p>

            <h2>10. Luật áp dụng</h2>
            <p>
              Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.
            </p>

            <h2>11. Liên hệ</h2>
            <p>
              Nếu bạn có câu hỏi về điều khoản sử dụng này, vui lòng liên hệ:
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
