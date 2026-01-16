"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon as Loader2, CreditCardIcon as CreditCard } from "@hugeicons/core-free-icons"

export function PayOSTopup() {
  const [amount, setAmount] = useState<number>(100)
  const [loading, setLoading] = useState(false)
  const [payosLoaded, setPayosLoaded] = useState(false)
  
  // PayOS Config
  const [checkoutUrl, setCheckoutUrl] = useState("")

  const handleCreatePayment = async () => {
    if (amount < 99) {
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
          amount,
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
    <Card className="border-primary/10 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-none overflow-hidden">
      <Script 
        src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"
        onLoad={() => setPayosLoaded(true)}
      />
      
      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="amount" className="text-sm font-medium">Nhập số Xu muốn nạp</Label>
            <span className="text-xs text-muted-foreground">Tối thiểu 99 Xu</span>
          </div>
          
          <div className="relative">
            <Input
              id="amount"
              type="number"
              min="99"
              step="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Nhập số Xu..."
              disabled={loading}
              className="pl-4 pr-24 h-12 text-lg font-semibold rounded-xl"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-muted-foreground bg-muted/50 px-2 py-1 rounded-md text-xs font-medium">
              = {(amount * 1000).toLocaleString('vi-VN')}đ
            </div>
          </div>
        </div>

        <Button 
          onClick={handleCreatePayment} 
          disabled={loading || !payosLoaded || amount < 99} 
          className="w-full h-11 rounded-full text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <>
              <HugeiconsIcon icon={Loader2} className="mr-2 h-4 w-4 animate-spin" />
              Đang tạo mã QR...
            </>
          ) : (
            "Nạp ngay"
          )}
        </Button>

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
