import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import { PayOSTopup } from "@/components/wallet/payos-topup"
import {
  Wallet01Icon as Wallet,
  CircleArrowUp01Icon as ArrowUpCircle,
  CircleArrowDown01Icon as ArrowDownCircle,
  Time01Icon as Clock,
  Exchange01Icon as Exchange
} from "@hugeicons/core-free-icons"

function formatXu(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const transactionTypeLabels: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  deposit: {
    label: "Nạp Xu",
    icon: <HugeiconsIcon icon={ArrowUpCircle} className="h-4 w-4" />,
    className: "bg-green-500/10 text-green-600 dark:text-green-400"
  },
  expense: {
    label: "Chi tiêu",
    icon: <HugeiconsIcon icon={ArrowDownCircle} className="h-4 w-4" />,
    className: "bg-red-500/10 text-red-600 dark:text-red-400"
  },
  refund: {
    label: "Hoàn tiền",
    icon: <HugeiconsIcon icon={Exchange} className="h-4 w-4" />,
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
  },
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

  // Fetch transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select(`
      *,
      orders (
        id,
        services (name)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Calculate total spent
  const totalSpent = transactions
    ?.filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0

  const totalDeposited = transactions
    ?.filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0) || 0

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ví của bạn</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý số dư và lịch sử giao dịch.
        </p>
      </div>

      {/* Stats Grid - Minimal Style */}
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

      <div className="grid gap-8 md:grid-cols-7">
        {/* Main Content: Topup & Transactions */}
        <div className="md:col-span-4 space-y-6">
           <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Lịch sử giao dịch</h2>
          </div>
          
          <Card className="border-none shadow-none bg-transparent">
            <div className="space-y-3">
              {transactions && transactions.length > 0 ? (
                transactions.map((transaction) => {
                  const typeInfo = transactionTypeLabels[transaction.type]
                  return (
                    <div
                      key={transaction.id}
                      className="group flex items-center justify-between p-4 rounded-2xl border bg-card hover:border-primary/20 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${typeInfo.className}`}>
                          {typeInfo.icon}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{typeInfo.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.orders
                              ? `Đơn hàng: ${(transaction.orders as { services: { name: string } }).services?.name || 'N/A'}`
                              : formatDate(transaction.created_at)
                            }
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}{formatXu(transaction.amount)} Xu
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed">
                  <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <HugeiconsIcon icon={Clock} className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium">Chưa có giao dịch</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lịch sử nạp và chi tiêu sẽ xuất hiện tại đây.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar: Topup */}
        <div className="md:col-span-3 space-y-6">
           <h2 className="text-lg font-semibold tracking-tight">Nạp thêm Xu</h2>
           <PayOSTopup />
        </div>
      </div>
    </div>
  )
}

