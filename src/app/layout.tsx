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

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://taophim.com'

export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: "Taophim - Dịch vụ tạo video AI #1 Việt Nam",
    template: "%s | Taophim",
  },
  description: "Nền tảng tạo video AI hàng đầu Việt Nam. Ghép mặt (Face Swap), tạo video từ ảnh, text-to-video với công nghệ AI tiên tiến. Tiết kiệm 90% thời gian và chi phí.",
  keywords: [
    "AI video",
    "tạo video AI",
    "ghép mặt",
    "face swap",
    "face swap Việt Nam",
    "video AI Việt Nam",
    "tạo video từ ảnh",
    "image to video",
    "text to video",
    "Taophim",
    "công nghệ AI",
    "chỉnh sửa video",
    "video marketing",
    "content creator",
    "TikTok video",
    "Reels video",
  ],
  authors: [{ name: "Taophim" }],
  creator: "Taophim",
  publisher: "Taophim",
  
  // Favicon and icons
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon-32.png",
  },
  manifest: "/site.webmanifest",
  
  // Canonical URL
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: "/",
    languages: {
      "vi-VN": "/",
    },
  },
  
  // OpenGraph metadata for social sharing
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: BASE_URL,
    siteName: "Taophim",
    title: "Taophim - Dịch vụ tạo video AI #1 Việt Nam",
    description: "Nền tảng tạo video AI hàng đầu Việt Nam. Ghép mặt, tạo video từ ảnh với công nghệ AI tiên tiến. Tiết kiệm 90% thời gian.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Taophim - Nền tảng tạo video AI hàng đầu Việt Nam",
      },
    ],
  },
  
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Taophim - Dịch vụ tạo video AI #1 Việt Nam",
    description: "Nền tảng tạo video AI hàng đầu Việt Nam. Ghép mặt, tạo video từ ảnh với công nghệ AI tiên tiến.",
    images: ["/og-image.png"],
    creator: "@taophim",
  },
  
  // Robots directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Verification
  verification: {
    google: "p70tZR-mTP2SwExwu8egoBzuaa_G2VdmT3I-nGtuOng",
  },
  
  // App-specific metadata
  applicationName: "Taophim",
  category: "technology",
  classification: "AI Video Generation Platform",
}

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Taophim",
  "alternateName": "Taophim.com",
  "description": "Nền tảng tạo video AI hàng đầu Việt Nam. Ghép mặt, tạo video từ ảnh với công nghệ AI tiên tiến.",
  "url": "https://taophim.com",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "VND",
    "description": "Bắt đầu miễn phí với Xu khuyến mãi"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "1000"
  },
  "provider": {
    "@type": "Organization",
    "name": "Taophim",
    "url": "https://taophim.com"
  },
  "inLanguage": "vi-VN"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${inter.variable} dark`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
