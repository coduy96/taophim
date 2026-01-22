import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào Taophim để sử dụng dịch vụ tạo video AI hàng đầu Việt Nam. Ghép mặt, tạo video từ ảnh với công nghệ AI tiên tiến.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Đăng nhập | Taophim",
    description: "Đăng nhập vào Taophim để sử dụng dịch vụ tạo video AI hàng đầu Việt Nam.",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
