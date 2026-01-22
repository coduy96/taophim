import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản Taophim miễn phí để bắt đầu tạo video AI chuyên nghiệp. Ghép mặt, tạo video từ ảnh với công nghệ AI tiên tiến nhất.",
  alternates: {
    canonical: "/register",
  },
  openGraph: {
    title: "Đăng ký tài khoản | Taophim",
    description: "Tạo tài khoản Taophim miễn phí để bắt đầu tạo video AI chuyên nghiệp.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
