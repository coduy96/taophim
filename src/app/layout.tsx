import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Taophim - Dịch vụ tạo video AI",
  description: "Nền tảng tạo video AI hàng đầu Việt Nam. Ghép mặt, tạo video từ ảnh với công nghệ AI tiên tiến.",
  keywords: ["AI video", "ghép mặt", "face swap", "tạo video", "video AI Việt Nam"],
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-center" />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
