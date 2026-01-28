import type { Metadata } from "next"
import { RegisterForm } from "./register-form"

export const metadata: Metadata = {
  title: "Đăng ký tài khoản",
  description: "Đăng ký tài khoản Taophim miễn phí. Bắt đầu tạo video AI chuyên nghiệp: Ảnh thành Video, Thay đổi nhân vật, Tạo Video từ Văn Bản.",
  openGraph: {
    title: "Đăng ký tài khoản | Taophim",
    description: "Đăng ký miễn phí và bắt đầu tạo video AI chuyên nghiệp ngay hôm nay.",
  },
}

export default function RegisterPage() {
  return <RegisterForm />
}
