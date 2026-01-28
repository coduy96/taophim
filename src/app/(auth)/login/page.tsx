import type { Metadata } from "next"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào Taophim để tạo video AI chuyên nghiệp. Ảnh thành Video, Thay đổi nhân vật, Tạo Video từ Văn Bản.",
  openGraph: {
    title: "Đăng nhập | Taophim",
    description: "Đăng nhập vào Taophim để tạo video AI chuyên nghiệp.",
  },
}

export default function LoginPage() {
  return <LoginForm />
}
