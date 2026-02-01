import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import { PayOSTopup } from "@/components/wallet/payos-topup"
import { TransactionHistorySheet } from "@/components/wallet/transaction-history-sheet"
import {
  Wallet01Icon as Wallet,
  CircleArrowUp01Icon as ArrowUpCircle,
  CircleArrowDown01Icon as ArrowDownCircle,
  SecurityCheckIcon as Shield,
  Time01Icon as Clock,
  Exchange01Icon as Exchange,
} from "@hugeicons/core-free-icons"

function formatXu(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  })
}

const transactionTypeConfig: Record<string, { label: string; icon: typeof ArrowUpCircle; colorClass: string }> = {
  deposit: { label: "Nạp Xu", icon: ArrowUpCircle, colorClass: "text-green-600" },
  expense: { label: "Chi tiêu", icon: ArrowDownCircle, colorClass: "text-red-600" },
  refund: { label: "Hoàn tiền", icon: Exchange, colorClass: "text-blue-600" },
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

  // Fetch recent transactions (last 5) for preview
  const { data: recentTransactions } = await supabase
    .from('transactions')
    .select('id, type, amount, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Calculate totals
  const totalSpent = allTransactions
    ?.filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0

  const totalDeposited = allTransactions
    ?.filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0) || 0

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* Hero Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 p-6 md:p-8 shadow-xl">
        {/* Animated gradient orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-slow [animation-delay:3s]" />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-grid-white opacity-[0.02]" />

        {/* Shimmer effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Balance Info */}
          <div className="space-y-1">
            <p className="text-zinc-400 text-sm font-medium flex items-center gap-2">
              <HugeiconsIcon icon={Wallet} className="h-4 w-4" />
              Số dư khả dụng
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent animate-gradient-x">
                {formatXu(profile?.xu_balance || 0)}
              </span>
              <span className="text-2xl font-semibold text-white/80">Xu</span>
            </div>
            {profile && profile.frozen_xu > 0 && (
              <p className="text-sm text-zinc-500 flex items-center gap-1.5 mt-1">
                <HugeiconsIcon icon={Clock} className="h-3.5 w-3.5" />
                Đang giữ: {formatXu(profile.frozen_xu)} Xu
              </p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 md:gap-6">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-emerald-400">
                {totalDeposited > 0 && '+'}{formatXu(totalDeposited)} <span className="text-lg">Xu</span>
              </p>
              <p className="text-xs text-zinc-500">Đã nạp</p>
            </div>
            <div className="w-px bg-zinc-700" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-red-400">
                {totalSpent > 0 && '-'}{formatXu(totalSpent)} <span className="text-lg">Xu</span>
              </p>
              <p className="text-xs text-zinc-500">Đã chi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Top-up + History */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top-up Section - Takes 2/3 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Nạp Xu nhanh</h2>
            {/* Trust Badge */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
              <HugeiconsIcon icon={Shield} className="h-3.5 w-3.5 text-green-600" />
              <span>Thanh toán an toàn</span>
            </div>
          </div>
          <PayOSTopup />
        </div>

        {/* Recent Transactions Sidebar - Takes 1/3 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Giao dịch gần đây</h2>
            <TransactionHistorySheet
              totalDeposited={totalDeposited}
              totalSpent={totalSpent}
            />
          </div>

          <Card className="divide-y">
            {recentTransactions && recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => {
                const config = transactionTypeConfig[tx.type] || transactionTypeConfig.expense
                return (
                  <div key={tx.id} className="flex items-center justify-between p-3 first:rounded-t-lg last:rounded-b-lg">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center ${config.colorClass}`}>
                        <HugeiconsIcon icon={config.icon} className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{config.label}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${config.colorClass}`}>
                      {tx.amount > 0 ? '+' : ''}{formatXu(tx.amount)} Xu
                    </span>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center mb-2">
                  <HugeiconsIcon icon={Clock} className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Chưa có giao dịch</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
