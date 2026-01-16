"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Coins01Icon as Coins } from "@hugeicons/core-free-icons"
import { createClient } from "@/lib/supabase/client"

export function TopUpUserForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [amount, setAmount] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !amount) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    const amountNum = parseInt(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Số lượng Xu không hợp lệ")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      // Use the top_up_user RPC function
      const { error } = await supabase.rpc('top_up_user', {
        p_email: email,
        p_amount: amountNum
      })

      if (error) throw error

      toast.success(`Đã nạp ${amountNum.toLocaleString('vi-VN')} Xu cho ${email}`)
      setEmail("")
      setAmount("")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="email" className="text-xs">Email người dùng</Label>
        <Input
          id="email"
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="amount" className="text-xs">Số lượng Xu</Label>
        <Input
          id="amount"
          type="number"
          min="1"
          placeholder="100"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Spinner className="mr-2 h-4 w-4" />
        ) : (
          <HugeiconsIcon icon={Coins} className="mr-2 h-4 w-4" />
        )}
        Nạp Xu
      </Button>
    </form>
  )
}
