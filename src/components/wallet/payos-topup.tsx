"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, CreditCard } from "lucide-react"

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
    <Card className="group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      <Script 
        src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"
        onLoad={() => setPayosLoaded(true)}
      />
      
      <CardHeader className="relative">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
          <CreditCard className="h-7 w-7 text-primary" />
        </div>
        <CardTitle className="group-hover:text-primary transition-colors">
          Nạp Xu Online (PayOS)
        </CardTitle>
        <CardDescription>
          Nạp Xu tự động 24/7 qua QR Code ngân hàng.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Số Xu muốn nạp</Label>
          <div className="flex gap-2">
            <Input
              id="amount"
              type="number"
              min="99"
              step="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Nhập số Xu (min 99)"
              disabled={loading}
              className="rounded-xl"
            />
            <Button onClick={handleCreatePayment} disabled={loading || !payosLoaded} className="rounded-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Nạp ngay"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            1.000đ = 1 Xu. Tối thiểu 99 Xu (99.000đ).
          </p>
        </div>

        {/* Embedded Container */}
        <div 
          id="embedded-payment-container" 
          className="w-full h-[500px] transition-all rounded-2xl overflow-hidden"
          style={{ display: checkoutUrl ? 'block' : 'none' }}
        >
        </div>
      </CardContent>
    </Card>
  )
}
