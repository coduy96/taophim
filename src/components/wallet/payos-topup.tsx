"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Loading03Icon as Loader2,
  CheckmarkCircle02Icon as Check,
  QrCodeIcon as QrCode,
  CreditCardIcon as CreditCard,
  BankIcon as Bank,
  SecurityCheckIcon as Shield,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface XuPackage {
  slug: string
  label: string
  tagline: string
  base_xu: number
  bonus_xu: number
  total_xu: number
  price_vnd: number
  popular?: boolean
}

const XU_PACKAGES: XuPackage[] = [
  {
    slug: "starter",
    label: "Dùng thử",
    tagline: "Tạo 1-2 video đầu tiên",
    base_xu: 150,
    bonus_xu: 0,
    total_xu: 150,
    price_vnd: 150000
  },
  {
    slug: "popular",
    label: "Tiết kiệm",
    tagline: "Được chọn nhiều nhất",
    base_xu: 500,
    bonus_xu: 50,
    total_xu: 550,
    price_vnd: 500000,
    popular: true
  },
  {
    slug: "pro",
    label: "Pro",
    tagline: "Dành cho creator chuyên nghiệp",
    base_xu: 1500,
    bonus_xu: 300,
    total_xu: 1800,
    price_vnd: 1500000
  },
]

export function PayOSTopup() {
  const [selectedPackage, setSelectedPackage] = useState<XuPackage>(XU_PACKAGES[1]) // Default to "Phổ biến"
  const [loading, setLoading] = useState(false)
  const [payosLoaded, setPayosLoaded] = useState(false)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [paymentPackage, setPaymentPackage] = useState<XuPackage | null>(null)

  const handleSelectPackage = (pkg: XuPackage) => {
    setSelectedPackage(pkg)
  }

  const handleCreatePayment = async () => {
    if (!payosLoaded) {
      toast.error("Hệ thống thanh toán đang tải, vui lòng thử lại")
      return
    }

    try {
      setLoading(true)
      setPaymentPackage(selectedPackage)

      // 1. Create Payment Link via API
      const response = await fetch("/api/payment/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package_slug: selectedPackage.slug,
          returnUrl: window.location.href,
          cancelUrl: window.location.href
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Không thể tạo link thanh toán")
      }

      // 2. Open dialog and PayOS
      setDialogOpen(true)

      // Small delay to ensure dialog is mounted
      setTimeout(() => {
        openPayOS(data.checkoutUrl)
      }, 100)

    } catch (error: unknown) {
      console.error(error)
      const message = error instanceof Error ? error.message : "Có lỗi xảy ra"
      toast.error(message)
      setLoading(false)
    }
  }

  const openPayOS = (url: string) => {
    const payosWindow = window as Window & { PayOSCheckout?: { usePayOS: (config: Record<string, unknown>) => { open: () => void } } }
    if (!payosWindow.PayOSCheckout) {
      toast.error("Lỗi thư viện thanh toán")
      setLoading(false)
      setDialogOpen(false)
      return
    }

    const config = {
      RETURN_URL: window.location.href,
      ELEMENT_ID: "payment-dialog-container",
      CHECKOUT_URL: url,
      embedded: true,
      onSuccess: () => {
        toast.success("Thanh toán thành công! Xu đã được cộng vào tài khoản.")
        setLoading(false)
        setDialogOpen(false)
        // Refresh page to show new balance
        window.location.reload()
      },
      onExit: () => {
        setLoading(false)
      },
      onCancel: () => {
        toast.info("Đã hủy thanh toán")
        setLoading(false)
        setDialogOpen(false)
      }
    }

    const { open } = payosWindow.PayOSCheckout.usePayOS(config)
    open()
  }

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setLoading(false)
    }
    setDialogOpen(open)
  }

  useEffect(() => {
    // Check if PayOS is already loaded (in case of navigation/caching)
    const payosWindow = window as Window & { PayOSCheckout?: unknown }
    if (payosWindow.PayOSCheckout) {
      setPayosLoaded(true)
    }
  }, [])

  return (
    <>
      <Script
        src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"
        onLoad={() => setPayosLoaded(true)}
      />

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5">
          {/* Package Grid - always 3 columns */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {XU_PACKAGES.map((pkg) => {
              const isSelected = selectedPackage.slug === pkg.slug
              return (
                <button
                  key={pkg.slug}
                  onClick={() => handleSelectPackage(pkg)}
                  disabled={loading}
                  className={cn(
                    "relative flex flex-col items-center text-center p-2.5 sm:p-5 rounded-xl border-2 transition-all duration-200",
                    "hover:border-primary/50 hover:bg-primary/5 active:scale-[0.97]",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border/50 bg-background",
                    pkg.popular && "ring-2 ring-orange-500/20"
                  )}
                >
                  {/* Popular Badge */}
                  {pkg.popular && (
                    <span className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 px-1.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white rounded-full bg-orange-500 whitespace-nowrap">
                      <span className="hidden sm:inline">🔥 </span>Phổ biến
                    </span>
                  )}

                  {/* Selected Check */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3">
                      <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-primary flex items-center justify-center">
                        <HugeiconsIcon icon={Check} className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary-foreground" />
                      </div>
                    </div>
                  )}

                  {/* Label */}
                  <h3 className={cn(
                    "text-xs sm:text-base font-bold mb-0.5 sm:mb-1",
                    isSelected ? "text-primary" : "text-foreground",
                    pkg.popular && "mt-1.5 sm:mt-2"
                  )}>
                    {pkg.label}
                  </h3>

                  {/* Tagline - hidden on mobile */}
                  <p className="hidden sm:block text-sm text-muted-foreground mb-4">
                    {pkg.tagline}
                  </p>

                  {/* Xu Amount */}
                  <div className="mb-0.5 sm:mb-1">
                    <span className={cn(
                      "text-xl sm:text-3xl font-bold tracking-tight",
                      isSelected ? "text-primary" : "text-foreground"
                    )}>
                      {pkg.total_xu.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-xs sm:text-lg font-semibold text-muted-foreground ml-0.5 sm:ml-1">Xu</span>
                  </div>

                  {/* Price */}
                  <p className="text-[11px] sm:text-sm text-muted-foreground mb-1 sm:mb-3">
                    {(pkg.price_vnd / 1000).toLocaleString('vi-VN')}k
                  </p>

                  {/* Bonus Badge */}
                  {pkg.bonus_xu > 0 ? (
                    <span className="px-1.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30 rounded-full">
                      +{pkg.bonus_xu} Xu
                    </span>
                  ) : (
                    <span className="h-4 sm:h-6" />
                  )}
                </button>
              )
            })}
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => handleCreatePayment()}
            disabled={loading || !payosLoaded}
            size="lg"
            className="w-full h-11 sm:h-12 rounded-xl text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all"
          >
            {loading ? (
              <>
                <HugeiconsIcon icon={Loader2} className="mr-2 h-5 w-5 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                Nạp ngay {selectedPackage.total_xu.toLocaleString('vi-VN')} Xu
              </>
            )}
          </Button>

          {/* Trust Signals */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Shield} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                Bảo mật 100%
              </span>
              <span>•</span>
              <span>Xu về ngay</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-muted-foreground/70">
              <HugeiconsIcon icon={QrCode} className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <HugeiconsIcon icon={CreditCard} className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <HugeiconsIcon icon={Bank} className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>QR · VNPAY · MoMo · CK</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 pb-3 border-b bg-muted/30">
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={QrCode} className="h-5 w-5 text-primary" />
              Thanh toán {paymentPackage?.total_xu.toLocaleString('vi-VN')} Xu
            </DialogTitle>
            <DialogDescription className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Shield} className="h-3.5 w-3.5 text-green-600" />
                Bảo mật SSL
              </span>
              <span>Tổng: {paymentPackage?.price_vnd.toLocaleString('vi-VN')}đ</span>
              {paymentPackage && paymentPackage.bonus_xu > 0 && (
                <span className="text-green-600 font-medium">+{paymentPackage.bonus_xu} bonus</span>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* PayOS Container */}
          <div
            id="payment-dialog-container"
            className="w-full bg-white"
            style={{ height: '480px' }}
          />

          {/* Footer hint */}
          <div className="p-3 border-t bg-muted/30 text-center">
            <p className="text-sm text-muted-foreground">
              Quét mã QR bằng ứng dụng ngân hàng hoặc ví điện tử
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
