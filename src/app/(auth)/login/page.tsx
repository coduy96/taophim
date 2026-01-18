import type { Metadata } from "next"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào Taophim để tạo video AI chuyên nghiệp. Ghép mặt, tạo video từ ảnh với công nghệ AI tiên tiến.",
  openGraph: {
    title: "Đăng nhập | Taophim",
    description: "Đăng nhập vào Taophim để tạo video AI chuyên nghiệp.",
  },
}

export default function LoginPage() {
  return <LoginForm />
}
