import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { Analytics } from "@/components/analytics"
import { FacebookMessengerChat } from "@/components/facebook-messenger-chat"

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
})

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://taophim.com'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
}

export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: "Taophim - Dịch Vụ Tạo Phim AI & Video AI Chuyên Nghiệp #1 Việt Nam",
    template: "%s | Taophim",
  },
  description: "Dịch vụ tạo phim AI, tạo video từ ảnh chất lượng 4K tại Việt Nam. Không cần kỹ năng, không cần thẻ quốc tế. Thanh toán VietQR, nhận video nhanh chóng. Tiết kiệm 90% chi phí so với thuê editor.",
  keywords: [
    // Primary keywords - High intent
    "tạo phim AI",
    "tạo video AI",
    "dịch vụ tạo phim",
    "làm phim AI",
    "video AI Việt Nam",
    "phim AI Việt Nam",
    // Service-specific
    "tạo video TikTok AI",
    "tạo video Reels AI",
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
    "tạo phim quảng cáo AI",
    "tạo video bán hàng AI",
    "video quảng cáo AI",
    "content creator tool Vietnam",
  ],
  authors: [{ name: "Taophim", url: BASE_URL }],
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
    title: "Taophim - Dịch Vụ Tạo Phim AI & Video AI Chuyên Nghiệp #1 Việt Nam",
    description: "Biến ảnh của bạn thành video viral chỉ trong vài phút. Dịch vụ tạo phim AI, tạo video từ ảnh chất lượng 4K. Thanh toán VietQR, không cần thẻ quốc tế.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Taophim - Nền tảng tạo phim AI hàng đầu Việt Nam",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    site: "@taophim",
    creator: "@taophim",
    title: "Taophim - Dịch Vụ Tạo Phim AI & Video AI Chuyên Nghiệp #1 Việt Nam",
    description: "Biến ảnh thành video viral chất lượng 4K. Tạo phim AI, tạo video từ ảnh. Thanh toán VietQR, nhận video nhanh chóng.",
    images: ["/twitter-image"],
  },

  // Robots directives
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
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

  // Mobile optimization
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  // Other metadata
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Taophim",
    "msapplication-TileColor": "#09090b",
    "msapplication-config": "/browserconfig.xml",
  },
}

// Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Taophim",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/logo.webp`,
    width: 512,
    height: 512,
  },
  sameAs: [
    "https://www.facebook.com/profile.php?id=61573590554545",
    "https://www.tiktok.com/@taophimaichonguoiviet?is_from_webapp=1&sender_device=pc",
    "https://www.youtube.com/@T%E1%BA%A1oPhimAI",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@taophim.com",
    contactType: "customer service",
    availableLanguage: ["Vietnamese", "English"],
  },
}

// WebSite Schema with SearchAction
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "Taophim",
  url: BASE_URL,
  publisher: {
    "@id": `${BASE_URL}/#organization`,
  },
  inLanguage: "vi-VN",
  description: "Nền tảng tạo phim AI hàng đầu Việt Nam",
}

// SoftwareApplication Schema
const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${BASE_URL}/#software`,
  name: "Taophim",
  alternateName: ["Taophim.com", "Tạo Phim AI", "Video AI Việt Nam"],
  description: "Dịch vụ tạo phim AI và tạo video từ ảnh chất lượng 4K tại Việt Nam. Không cần kỹ năng, thanh toán VietQR, nhận video nhanh chóng.",
  url: BASE_URL,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "VND",
    description: "Đăng ký miễn phí, chỉ trả phí khi sử dụng dịch vụ",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "1523",
    bestRating: "5",
    worstRating: "1",
  },
  provider: {
    "@id": `${BASE_URL}/#organization`,
  },
  featureList: [
    "Tạo phim AI chuyên nghiệp",
    "Tạo video từ ảnh (Image to Video)",
    "Video chất lượng 4K",
    "Thanh toán VietQR",
    "Không cần thẻ quốc tế",
    "Hỗ trợ tiếng Việt",
  ],
  screenshot: `${BASE_URL}/images/landing/long-form-bg.webp`,
}

// FAQ Schema for featured snippets
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Tạo phim AI là gì?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tạo phim AI là công nghệ sử dụng trí tuệ nhân tạo để tạo video chuyên nghiệp từ ảnh hoặc mô tả văn bản. Taophim cung cấp dịch vụ tạo phim AI chất lượng cao, giúp bạn tạo video viral cho TikTok, Reels, YouTube Shorts mà không cần kỹ năng edit.",
      },
    },
    {
      "@type": "Question",
      name: "Taophim thanh toán bằng cách nào?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Taophim hỗ trợ thanh toán qua VietQR - quét mã QR bằng app ngân hàng Việt Nam. Không cần thẻ Visa/Mastercard quốc tế. Xu được cộng ngay sau khi thanh toán thành công.",
      },
    },
    {
      "@type": "Question",
      name: "Xu có thời hạn sử dụng không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Không, Xu tại Taophim được bảo lưu vĩnh viễn. Bạn nạp 1 lần và sử dụng bất cứ khi nào cần, không bị ép dùng hết trong tháng như các gói subscription.",
      },
    },
    {
      "@type": "Question",
      name: "Video AI được giao trong bao lâu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Thời gian xử lý phụ thuộc vào độ phức tạp của yêu cầu, thông thường từ vài phút đến vài giờ. Bạn sẽ nhận thông báo ngay khi video hoàn thành.",
      },
    },
  ],
}

// Combined JSON-LD
const jsonLdScripts = [
  organizationSchema,
  websiteSchema,
  softwareSchema,
  faqSchema,
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${inter.variable} dark`} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/images/landing/long-form-bg.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/images/landing/short-form-bg.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        {/* Preconnect to Supabase for faster image and API loading */}
        <link rel="preconnect" href="https://qzshnmpjubqpaqdcisky.supabase.co" />
        <link rel="dns-prefetch" href="https://qzshnmpjubqpaqdcisky.supabase.co" />
        {jsonLdScripts.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body
        className={`${inter.variable} antialiased min-h-screen bg-background font-sans`}
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
          <FacebookMessengerChat />
        </ThemeProvider>
      </body>
    </html>
  )
}
