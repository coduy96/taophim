import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PayOSTopup } from "@/components/wallet/payos-topup"
import { 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Clock,
  QrCode,
  Copy
} from "lucide-react"
import { Button } from "@/components/ui/button"

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
        <h1 className="text-3xl font-bold tracking-tight">Ví Xu</h1>
        <p className="text-muted-foreground">
          Quản lý số dư và lịch sử giao dịch của bạn.
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1 border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số dư khả dụng</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đã nạp</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{formatXu(totalDeposited)} Xu
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Từ tất cả các lần nạp
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đã chi</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
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

      {/* Top-up Instructions */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Hướng dẫn nạp Xu
          </CardTitle>
          <CardDescription>
            Làm theo các bước sau để nạp Xu vào tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Chuyển khoản</p>
                  <p className="text-sm text-muted-foreground">
                    Chuyển tiền đến tài khoản ngân hàng của chúng tôi
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Nội dung chuyển khoản</p>
                  <p className="text-sm text-muted-foreground">
                    Ghi rõ email đăng ký: <code className="bg-muted px-1 rounded">{user.email}</code>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Chờ xác nhận</p>
                  <p className="text-sm text-muted-foreground">
                    Admin sẽ cộng Xu trong vòng 24 giờ
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium mb-2">Thông tin chuyển khoản</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngân hàng:</span>
                  <span className="font-medium">Vietcombank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số tài khoản:</span>
                  <span className="font-medium">1234567890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chủ tài khoản:</span>
                  <span className="font-medium">CONG TY TAOPHIM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tỷ giá:</span>
                  <span className="font-medium text-primary">1.000đ = 1 Xu</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Lịch sử giao dịch
          </CardTitle>
          <CardDescription>
            Tất cả các giao dịch của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction) => {
                const typeInfo = transactionTypeLabels[transaction.type]
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${typeInfo.color}`}>
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
            <div className="text-center py-12 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có giao dịch nào</p>
              <p className="text-sm mt-1">Các giao dịch sẽ xuất hiện tại đây</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
