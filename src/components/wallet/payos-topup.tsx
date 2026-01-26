"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Loading03Icon as Loader2,
  Coins01Icon as Coins,
  Fire03Icon as Fire,
  CheckmarkCircle02Icon as Check
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface XuPackage {
  xu: number
  label: string
  badge?: string
  badgeColor?: string
  popular?: boolean
}

const XU_PACKAGES: XuPackage[] = [
  { xu: 100, label: "Dùng thử" },
  { xu: 200, label: "Cá nhân" },
  { xu: 500, label: "Phổ biến nhất", popular: true },
  { xu: 1000, label: "Chuyên nghiệp" },
]

export function PayOSTopup() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(500)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [payosLoaded, setPayosLoaded] = useState(false)

  // PayOS Config
  const [checkoutUrl, setCheckoutUrl] = useState("")

  const currentAmount = isCustomMode ? Number(customAmount) || 0 : (selectedPackage || 0)

  const handleSelectPackage = (xu: number) => {
    setSelectedPackage(xu)
    setIsCustomMode(false)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setIsCustomMode(true)
    setSelectedPackage(null)
  }

  const handleCreatePayment = async () => {
    if (currentAmount < 99) {
      toast.error("Số tiền nạp tối thiểu là 99 Xu (99.000đ)")
      return
    }

    if (!payosLoaded) {
      toast.error("Hệ thống thanh toán đang tải, vui lòng thử lại sau giây lát")
      return
    }

    try {
      setLoading(true)

      // 1. Create Payment Link via API
      const response = await fetch("/api/payment/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: currentAmount,
          returnUrl: window.location.href,
          cancelUrl: window.location.href
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Không thể tạo link thanh toán")
      }

      setCheckoutUrl(data.checkoutUrl)

      // 2. Open PayOS Embedded Form
      openPayOS(data.checkoutUrl)

    } catch (error: unknown) {
      console.error(error)
      const message = error instanceof Error ? error.message : "Có lỗi xảy ra"
      toast.error(message)
      setLoading(false) // Only stop loading on error, on success we might want to keep it or wait for close
    }
  }

  const openPayOS = (url: string) => {
    const payosWindow = window as Window & { PayOSCheckout?: { usePayOS: (config: Record<string, unknown>) => { open: () => void } } }
    if (!payosWindow.PayOSCheckout) {
      toast.error("Lỗi thư viện thanh toán")
      setLoading(false)
      return
    }

    const config = {
      RETURN_URL: window.location.href,
      ELEMENT_ID: "embedded-payment-container",
      CHECKOUT_URL: url,
      embedded: true,
      onSuccess: () => {
        toast.success("Thanh toán thành công!")
        setLoading(false)
        setCheckoutUrl("")
        // Refresh page to show new balance
        window.location.reload()
      },
      onExit: () => {
        setLoading(false)
      },
      onCancel: () => {
        toast.info("Đã hủy thanh toán")
        setLoading(false)
      }
    }

    const { open } = payosWindow.PayOSCheckout.usePayOS(config)
    open()
  }

  useEffect(() => {
    // Check if PayOS is already loaded (in case of navigation/caching)
    const payosWindow = window as Window & { PayOSCheckout?: unknown }
    if (payosWindow.PayOSCheckout) {
      setPayosLoaded(true)
    }
  }, [])

  return (
    <Card className="border-primary/10 bg-gradient-to-br from-primary/5 via-background to-background shadow-none overflow-hidden">
      <Script
        src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"
        onLoad={() => setPayosLoaded(true)}
      />

      <div className="p-6 space-y-6">
        {/* Package Grid - Responsive Full Width */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {XU_PACKAGES.map((pkg) => {
            const isSelected = selectedPackage === pkg.xu && !isCustomMode
            return (
              <button
                key={pkg.xu}
                onClick={() => handleSelectPackage(pkg.xu)}
                disabled={loading}
                className={cn(
                  "relative flex flex-col items-center justify-center p-5 md:p-6 rounded-2xl border-2 transition-all duration-200",
                  "hover:border-primary/50 hover:bg-primary/5",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                    : "border-border/50 bg-card"
                )}
              >
                {/* Badge */}
                {pkg.badge && (
                  <span className={cn(
                    "absolute -top-2.5 -right-2.5 px-2.5 py-1 text-[10px] font-bold text-white rounded-full shadow-sm",
                    pkg.badgeColor || "bg-primary"
                  )}>
                    {pkg.badge}
                  </span>
                )}

                {/* Selected Check */}
                {isSelected && (
                  <div className="absolute top-2 left-2">
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <HugeiconsIcon icon={Check} className="h-3 w-3 text-primary-foreground" />
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className={cn(
                  "mb-3 p-3 rounded-full",
                  isSelected ? "bg-primary/20" : "bg-muted/50"
                )}>
                  <HugeiconsIcon
                    icon={pkg.popular ? Fire : Coins}
                    className={cn(
                      "h-6 w-6",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>

                {/* Xu Amount */}
                <span className={cn(
                  "text-2xl md:text-3xl font-bold",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {pkg.xu.toLocaleString('vi-VN')}
                </span>
                <span className="text-sm text-muted-foreground font-medium">Xu</span>

                {/* Price */}
                <span className="mt-2 text-base font-semibold text-muted-foreground">
                  {(pkg.xu * 1000).toLocaleString('vi-VN')}đ
                </span>

                {/* Label */}
                <span className="mt-1 text-xs text-muted-foreground/70">
                  {pkg.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-sm text-muted-foreground">hoặc nhập số tuỳ chọn</span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* Custom Amount & Summary Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Custom Amount */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Số Xu tuỳ chọn
            </label>
            <div className="relative">
              <Input
                type="number"
                min="99"
                step="1"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder="Nhập số Xu (tối thiểu 99)"
                disabled={loading}
                className={cn(
                  "h-14 pl-5 pr-16 text-lg font-semibold rounded-xl",
                  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                  isCustomMode && customAmount
                    ? "border-primary ring-2 ring-primary/20"
                    : ""
                )}
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                Xu
              </span>
            </div>
            {customAmount && Number(customAmount) > 0 && (
              <p className="text-sm text-muted-foreground pl-1">
                = {(Number(customAmount) * 1000).toLocaleString('vi-VN')}đ
              </p>
            )}
          </div>

          {/* Summary & CTA */}
          <div className="flex flex-col justify-end space-y-4">
            {currentAmount > 0 && (
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Số Xu nạp:</span>
                  <span className="font-bold text-xl text-primary">
                    {currentAmount.toLocaleString('vi-VN')} Xu
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Thành tiền:</span>
                  <span className="font-semibold text-lg">
                    {(currentAmount * 1000).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={handleCreatePayment}
              disabled={loading || !payosLoaded || currentAmount < 99}
              size="lg"
              className="w-full h-14 rounded-xl text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <HugeiconsIcon icon={Loader2} className="mr-2 h-5 w-5 animate-spin" />
                  Đang tạo mã QR...
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={Coins} className="mr-2 h-5 w-5" />
                  Nạp ngay {currentAmount > 0 && `${currentAmount.toLocaleString('vi-VN')} Xu`}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Embedded Container */}
        <div
          id="embedded-payment-container"
          className="w-full transition-all rounded-xl overflow-hidden border border-border/50 bg-background shadow-inner"
          style={{
            height: checkoutUrl ? '500px' : '0',
            opacity: checkoutUrl ? 1 : 0,
            marginTop: checkoutUrl ? '1.5rem' : '0',
            pointerEvents: checkoutUrl ? 'auto' : 'none'
          }}
        >
        </div>
      </div>
    </Card>
  )
}
