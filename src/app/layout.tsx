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
    default: "Taophim - Ghép Mặt AI & Tạo Video AI Chuyên Nghiệp | Giá Rẻ #1 Việt Nam",
    template: "%s | Taophim - Video AI Việt Nam",
  },
  description: "Dịch vụ ghép mặt AI (Face Swap), tạo video từ ảnh chất lượng 4K tại Việt Nam. Không cần kỹ năng, không cần thẻ quốc tế. Thanh toán VietQR, nhận video trong vài giờ. Tiết kiệm 90% chi phí so với thuê editor.",
  keywords: [
    // Primary keywords - High intent
    "ghép mặt AI",
    "face swap AI",
    "dịch vụ ghép mặt",
    "ghép mặt video",
    "tạo video AI",
    "video AI Việt Nam",
    // Service-specific
    "ghép mặt TikTok",
    "ghép mặt Reels",
    "tạo video từ ảnh",
    "ảnh thành video",
    "image to video AI",
    "text to video tiếng Việt",
    // Benefit keywords
    "làm video không cần kỹ năng",
    "tạo video giá rẻ",
    "video marketing AI",
    // Brand + location
    "Taophim",
    "taophim.com",
    "công cụ video AI Việt Nam",
    // Long-tail
    "ghép mặt vào video có sẵn",
    "tạo video bán hàng AI",
    "video quảng cáo AI",
    "content creator tool Vietnam",
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
    title: "Ghép Mặt AI & Tạo Video Chuyên Nghiệp | Taophim.com",
    description: "Biến ảnh của bạn thành video viral chỉ trong vài giờ. Dịch vụ ghép mặt AI, tạo video từ ảnh chất lượng 4K. Thanh toán VietQR, không cần thẻ quốc tế.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Taophim - Dịch vụ ghép mặt AI và tạo video chất lượng cao tại Việt Nam",
      },
    ],
  },
  
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Ghép Mặt AI & Tạo Video Chuyên Nghiệp | Taophim",
    description: "Biến ảnh thành video viral chất lượng 4K. Ghép mặt AI, tạo video từ ảnh. Thanh toán VietQR, nhận video trong vài giờ.",
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
  "alternateName": ["Taophim.com", "Tạo Phim AI", "Ghép Mặt AI Việt Nam"],
  "description": "Dịch vụ ghép mặt AI (Face Swap) và tạo video từ ảnh chất lượng 4K tại Việt Nam. Không cần kỹ năng, thanh toán VietQR, nhận video trong vài giờ.",
  "url": "https://taophim.com",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "VND",
    "description": "Đăng ký miễn phí, chỉ trả phí khi sử dụng dịch vụ"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "1000",
    "bestRating": "5",
    "worstRating": "1"
  },
  "provider": {
    "@type": "Organization",
    "name": "Taophim",
    "url": "https://taophim.com",
    "logo": "https://taophim.com/logo.png"
  },
  "featureList": [
    "Ghép mặt AI (Face Swap)",
    "Tạo video từ ảnh (Image to Video)",
    "Video chất lượng 4K",
    "Thanh toán VietQR",
    "Không cần thẻ quốc tế"
  ],
  "inLanguage": "vi-VN",
  "audience": {
    "@type": "Audience",
    "audienceType": "Content Creators, Marketers, Business Owners"
  }
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
