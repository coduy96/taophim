"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"

// Question mark icon
const QuestionIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

interface FAQItem {
  question: string
  answer: string | React.ReactNode
}

const faqItems: FAQItem[] = [
  {
    question: "Taophim có những dịch vụ gì?",
    answer: (
      <div className="space-y-2">
        <p><strong>Ảnh thành Video:</strong> Chuyển đổi ảnh thành video chất lượng điện ảnh với chuyển động mượt mà. Hỗ trợ tự động tạo giọng nói tiếng Việt.</p>
        <p><strong>Thay đổi nhân vật:</strong> Thay đổi nhân vật từ video tham chiếu sang nhân vật trong ảnh của bạn. Lý tưởng cho các động tác nhảy múa và cử chỉ phức tạp.</p>
        <p><strong>Tạo Video từ Văn Bản:</strong> Chỉ cần mô tả ý tưởng bằng văn bản, AI sẽ tạo video chất lượng điện ảnh với chuyển động mượt mà.</p>
      </div>
    )
  },
  {
    question: "Video được tạo trong bao lâu?",
    answer: "Thông thường, video sẽ được hoàn thành trong vòng 5-30 phút tùy thuộc vào độ dài và độ phức tạp. Các video đơn giản (5-10 giây) thường chỉ mất khoảng 5-10 phút. Bạn sẽ nhận được thông báo ngay khi video hoàn thành."
  },
  {
    question: "Taophim hỗ trợ những định dạng file nào?",
    answer: (
      <div className="space-y-2">
        <p><strong>Đầu vào:</strong> Ảnh (JPG, PNG, WebP), Video (MP4, MOV, WebM) với dung lượng tối đa 50MB.</p>
        <p><strong>Đầu ra:</strong> Video MP4 chất lượng cao (720p-4K), không watermark, sẵn sàng đăng TikTok, Reels, YouTube Shorts.</p>
      </div>
    )
  },
  {
    question: "Xu là gì? 1 Xu bằng bao nhiêu tiền?",
    answer: "Xu là đơn vị tiền tệ trong Taophim. 1 Xu = 1.000 VNĐ. Ví dụ: Video 5 giây với giá 20 Xu/giây sẽ tốn 100 Xu (tương đương 100.000đ). Xu không có hạn sử dụng - nạp 1 lần dùng mãi mãi."
  },
  {
    question: "Tôi có thể hoàn tiền không?",
    answer: (
      <div className="space-y-2">
        <p><strong>Cam kết hoàn 100% Xu</strong> nếu video không đạt yêu cầu hoặc không thể thực hiện được. Xu sẽ được hoàn lại ngay vào tài khoản của bạn.</p>
        <p>Đối với Xu chưa sử dụng, bạn có thể yêu cầu hoàn tiền qua chuyển khoản trong vòng 7 ngày kể từ ngày nạp.</p>
      </div>
    )
  },
  {
    question: "Taophim khác gì so với mua tài khoản Runway, Pika, Kling?",
    answer: (
      <div className="space-y-2">
        <p><strong>Tiết kiệm hơn 90%:</strong> Mua subscription Runway/Pika tốn $30-$90/tháng (~750k-2.3 triệu VNĐ). Tại Taophim, bạn chỉ trả đúng giá trị video bạn tạo.</p>
        <p><strong>Không cần thẻ quốc tế:</strong> Thanh toán QR ngân hàng Việt Nam.</p>
        <p><strong>Không lo hết credits:</strong> Xu không có hạn sử dụng, không reset mỗi tháng.</p>
      </div>
    )
  },
  {
    question: "Ảnh và video của tôi có được bảo mật không?",
    answer: "Tuyệt đối bảo mật. Tất cả ảnh và video của bạn được mã hóa và tự động xóa sau 7 ngày. Chúng tôi cam kết không sử dụng dữ liệu của khách hàng cho mục đích training AI hay bất kỳ mục đích nào khác."
  },
  {
    question: "Tôi có thể dùng video để kinh doanh không?",
    answer: "Có! Video tạo ra hoàn toàn thuộc về bạn. Bạn có toàn quyền sử dụng cho mục đích cá nhân, kinh doanh, quảng cáo, đăng mạng xã hội mà không cần ghi nguồn hay trả thêm phí bản quyền."
  },
  {
    question: "Làm sao để nạp Xu?",
    answer: (
      <div className="space-y-2">
        <p>Rất đơn giản! Vào mục <strong>Ví Xu</strong> trong Dashboard, chọn số tiền muốn nạp, quét mã QR bằng app ngân hàng (Vietcombank, Techcombank, MB Bank, Momo...). Xu sẽ được cộng ngay lập tức sau khi thanh toán thành công.</p>
      </div>
    )
  },
  {
    question: "Tôi cần hỗ trợ thì liên hệ ở đâu?",
    answer: (
      <div className="space-y-2">
        <p>Bạn có thể liên hệ với chúng tôi qua:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Fanpage Facebook: <a href="https://www.facebook.com/profile.php?id=61573590554545" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Taophim AI</a></li>
          <li>TikTok: <a href="https://www.tiktok.com/@taophimaichonguoiviet" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@taophimaichonguoiviet</a></li>
          <li>Email: support@taophim.com</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-2">Thời gian phản hồi: Trong vòng 2 giờ (8:00 - 22:00 hàng ngày)</p>
      </div>
    )
  }
]

export function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <QuestionIcon className="w-4 h-4" />
            Câu hỏi thường gặp
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Bạn Có <span className="text-primary">Thắc Mắc?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dưới đây là những câu hỏi phổ biến nhất từ khách hàng. Nếu bạn cần hỗ trợ thêm, đừng ngần ngại liên hệ với chúng tôi.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4 border-0 rounded-none">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border/50 rounded-xl px-6 bg-background hover:border-primary/30 transition-colors data-[state=open]:border-primary/30 data-[state=open]:shadow-lg data-[state=open]:shadow-primary/5"
              >
                <AccordionTrigger className="text-left font-semibold py-5 hover:no-underline hover:text-primary transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still have questions? */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Vẫn chưa tìm được câu trả lời?
          </p>
          <Link
            href="https://www.facebook.com/profile.php?id=61573590554545"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            Liên hệ hỗ trợ ngay
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
