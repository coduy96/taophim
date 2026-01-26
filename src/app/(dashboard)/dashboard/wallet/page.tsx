import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import { PayOSTopup } from "@/components/wallet/payos-topup"
import { TransactionHistorySheet } from "@/components/wallet/transaction-history-sheet"
import {
  Wallet01Icon as Wallet,
  CircleArrowUp01Icon as ArrowUpCircle,
  CircleArrowDown01Icon as ArrowDownCircle,
} from "@hugeicons/core-free-icons"

function formatXu(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

export default async function WalletPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch all transactions for stats calculation
  const { data: allTransactions } = await supabase
    .from('transactions')
    .select('type, amount')
    .eq('user_id', user.id)

  // Calculate totals
  const totalSpent = allTransactions
    ?.filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0

  const totalDeposited = allTransactions
    ?.filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0) || 0

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nạp Xu</h1>
          <p className="text-muted-foreground mt-2">
            Nạp thêm Xu để sử dụng các dịch vụ tạo video AI.
          </p>
        </div>
        <TransactionHistorySheet
          totalDeposited={totalDeposited}
          totalSpent={totalSpent}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card size="sm" className="bg-primary/5 border-primary/10 hover:border-primary/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Số dư khả dụng</CardTitle>
            <HugeiconsIcon icon={Wallet} className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatXu(profile?.xu_balance || 0)} Xu
            </div>
            {profile && profile.frozen_xu > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Đang giữ: {formatXu(profile.frozen_xu)} Xu
              </p>
            )}
          </CardContent>
        </Card>

        <Card size="sm" className="hover:border-primary/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng đã nạp</CardTitle>
            <HugeiconsIcon icon={ArrowUpCircle} className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{formatXu(totalDeposited)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Từ tất cả các lần nạp
            </p>
          </CardContent>
        </Card>

        <Card size="sm" className="hover:border-primary/20 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng đã chi</CardTitle>
            <HugeiconsIcon icon={ArrowDownCircle} className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -{formatXu(totalSpent)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cho các dịch vụ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: PayOS Topup - Full Width */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Chọn gói nạp</h2>
        <PayOSTopup />
      </div>
    </div>
  )
}
