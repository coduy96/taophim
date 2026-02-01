"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Coins01Icon as Coins,
  Fire03Icon as Fire,
  CheckmarkCircle02Icon as Check,
  QrCodeIcon as QrCode,
  CreditCardIcon as CreditCard,
  BankIcon as Bank,
  SecurityCheckIcon as Shield,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface XuPackage {
  xu: number
  label: string
  badge?: string
  badgeColor?: string
  popular?: boolean
  savings?: string
}

const XU_PACKAGES: XuPackage[] = [
  { xu: 100, label: "Dùng thử" },
  { xu: 200, label: "Cá nhân" },
  { xu: 500, label: "Phổ biến", popular: true, badge: "Hot", badgeColor: "bg-orange-500" },
  { xu: 1000, label: "Chuyên nghiệp", savings: "Tiết kiệm" },
]

export function PayOSTopup() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(500)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [payosLoaded, setPayosLoaded] = useState(false)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState(0)

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

  const handleCreatePayment = async (amount?: number) => {
    const finalAmount = amount || currentAmount

    if (finalAmount < 99) {
      toast.error("Số tiền nạp tối thiểu là 99 Xu")
      return
    }

    if (!payosLoaded) {
      toast.error("Hệ thống thanh toán đang tải, vui lòng thử lại")
      return
    }

    try {
      setLoading(true)
      setPaymentAmount(finalAmount)

      // 1. Create Payment Link via API
      const response = await fetch("/api/payment/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
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
        <div className="p-5 md:p-6 space-y-5">
          {/* Package Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {XU_PACKAGES.map((pkg) => {
              const isSelected = selectedPackage === pkg.xu && !isCustomMode
              return (
                <button
                  key={pkg.xu}
                  onClick={() => handleSelectPackage(pkg.xu)}
                  disabled={loading}
                  className={cn(
                    "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
                    "hover:border-primary/50 hover:bg-primary/5",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border/50 bg-background"
                  )}
                >
                  {/* Badge */}
                  {pkg.badge && (
                    <span className={cn(
                      "absolute -top-2 right-2 px-2 py-0.5 text-[10px] font-bold text-white rounded-full",
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
                    "mb-2 p-2.5 rounded-full transition-colors",
                    isSelected ? "bg-primary/20" : "bg-muted/50"
                  )}>
                    <HugeiconsIcon
                      icon={pkg.popular ? Fire : Coins}
                      className={cn(
                        "h-5 w-5",
                        isSelected ? "text-primary" : "text-muted-foreground",
                        pkg.popular && "text-orange-500"
                      )}
                    />
                  </div>

                  {/* Xu Amount */}
                  <span className={cn(
                    "text-xl md:text-2xl font-bold",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {pkg.xu.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">Xu</span>

                  {/* Price */}
                  <span className="mt-1.5 text-sm font-semibold text-muted-foreground">
                    {(pkg.xu * 1000).toLocaleString('vi-VN')}đ
                  </span>

                  {/* Label/Savings */}
                  <span className={cn(
                    "mt-0.5 text-[10px]",
                    pkg.savings ? "text-green-600 font-medium" : "text-muted-foreground/70"
                  )}>
                    {pkg.savings || pkg.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Divider with Custom Option */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground">hoặc nhập số tuỳ chọn</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Custom Amount + CTA Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Custom Amount Input */}
            <div className="relative flex-1">
              <Input
                type="number"
                min="99"
                step="1"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder="Số Xu tuỳ chọn (tối thiểu 99)"
                disabled={loading}
                className={cn(
                  "h-12 pl-4 pr-12 text-base font-medium rounded-xl",
                  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                  isCustomMode && customAmount
                    ? "border-primary ring-1 ring-primary/20"
                    : ""
                )}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                Xu
              </span>
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => handleCreatePayment()}
              disabled={loading || !payosLoaded || currentAmount < 99}
              size="lg"
              className="h-12 px-6 rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-all sm:w-auto w-full"
            >
              {loading ? (
                <>
                  <HugeiconsIcon icon={Loader2} className="mr-2 h-5 w-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={QrCode} className="mr-2 h-5 w-5" />
                  Thanh toán {currentAmount > 0 && (
                    <span className="ml-1">{(currentAmount * 1000).toLocaleString('vi-VN')}đ</span>
                  )}
                </>
              )}
            </Button>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <HugeiconsIcon icon={QrCode} className="h-4 w-4" />
              <span>QR Code</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <HugeiconsIcon icon={CreditCard} className="h-4 w-4" />
              <span>VNPAY</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <HugeiconsIcon icon={Bank} className="h-4 w-4" />
              <span>Ngân hàng</span>
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
              Thanh toán {paymentAmount.toLocaleString('vi-VN')} Xu
            </DialogTitle>
            <DialogDescription className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Shield} className="h-3.5 w-3.5 text-green-600" />
                Bảo mật SSL
              </span>
              <span>Tổng: {(paymentAmount * 1000).toLocaleString('vi-VN')}đ</span>
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
            <p className="text-xs text-muted-foreground">
              Quét mã QR bằng ứng dụng ngân hàng hoặc ví điện tử
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
