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

    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
      setLoading(false) // Only stop loading on error, on success we might want to keep it or wait for close
    }
  }

  const openPayOS = (url: string) => {
    if (!(window as any).PayOSCheckout) {
      toast.error("Lỗi thư viện thanh toán")
      setLoading(false)
      return
    }

    const config = {
      RETURN_URL: window.location.href,
      ELEMENT_ID: "embedded-payment-container",
      CHECKOUT_URL: url,
      embedded: true,
      onSuccess: (event: any) => {
        toast.success("Thanh toán thành công!")
        setLoading(false)
        setCheckoutUrl("")
        // Refresh page to show new balance
        window.location.reload()
      },
      onExit: (event: any) => {
        setLoading(false)
      },
      onCancel: (event: any) => {
        toast.info("Đã hủy thanh toán")
        setLoading(false)
      }
    }

    const { open } = (window as any).PayOSCheckout.usePayOS(config)
    open()
  }

  useEffect(() => {
    // Check if PayOS is already loaded (in case of navigation/caching)
    if ((window as any).PayOSCheckout) {
      setPayosLoaded(true)
    }
  }, [])

  return (
    <Card className="border-primary/20 shadow-md">
      <Script 
        src="https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js"
        onLoad={() => setPayosLoaded(true)}
      />
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Nạp Xu Online (PayOS)
        </CardTitle>
        <CardDescription>
          Nạp Xu tự động 24/7 qua QR Code ngân hàng.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
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
            />
            <Button onClick={handleCreatePayment} disabled={loading || !payosLoaded}>
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
          className="w-full h-[500px] transition-all"
          style={{ display: checkoutUrl ? 'block' : 'none' }}
        >
        </div>
      </CardContent>
    </Card>
  )
}
