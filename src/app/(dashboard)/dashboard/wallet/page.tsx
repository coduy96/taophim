import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PayOSTopup } from "@/components/wallet/payos-topup"
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock
} from "lucide-react"

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

const transactionTypeLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  deposit: {
    label: "Nạp Xu",
    icon: <ArrowUpCircle className="h-4 w-4" />,
    color: "text-green-600 bg-green-100 dark:bg-green-900/30"
  },
  expense: {
    label: "Chi tiêu",
    icon: <ArrowDownCircle className="h-4 w-4" />,
    color: "text-red-600 bg-red-100 dark:bg-red-900/30"
  },
  refund: {
    label: "Hoàn tiền",
    icon: <ArrowUpCircle className="h-4 w-4" />,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30"
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          Ví Xu
        </h1>
        <p className="text-muted-foreground">
          Quản lý số dư và lịch sử giao dịch của bạn.
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="group md:col-span-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số dư khả dụng</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-primary">
              {formatXu(profile?.xu_balance || 0)} Xu
            </div>
            {profile && profile.frozen_xu > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Đang giữ: {formatXu(profile.frozen_xu)} Xu
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đã nạp</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <ArrowUpCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-green-600">
              +{formatXu(totalDeposited)} Xu
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Từ tất cả các lần nạp
            </p>
          </CardContent>
        </Card>

        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đã chi</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <ArrowDownCircle className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-red-600">
              -{formatXu(totalSpent)} Xu
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cho các đơn hàng
            </p>
          </CardContent>
        </Card>
      </div>

      <PayOSTopup />

      {/* Transaction History */}
      <Card className="group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
        <CardHeader className="relative">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
            <Clock className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="group-hover:text-primary transition-colors">
            Lịch sử giao dịch
          </CardTitle>
          <CardDescription>
            Tất cả các giao dịch của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          {transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction) => {
                const typeInfo = transactionTypeLabels[transaction.type]
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-background hover:bg-muted/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${typeInfo.color}`}>
                        {typeInfo.icon}
                      </div>
                      <div>
                        <p className="font-medium">{typeInfo.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.orders
                            ? `Đơn hàng: ${(transaction.orders as { services: { name: string } }).services?.name || 'N/A'}`
                            : formatDate(transaction.created_at)
                          }
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}{formatXu(transaction.amount)} Xu
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Wallet className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p>Chưa có giao dịch nào</p>
              <p className="text-sm mt-1">Các giao dịch sẽ xuất hiện tại đây</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
