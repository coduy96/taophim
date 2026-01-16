import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  UserGroupIcon as Users, 
  Coins01Icon as Coins, 
  Mail01Icon as Mail, 
  Calendar01Icon as Calendar 
} from "@hugeicons/core-free-icons"
import { TopUpUserForm } from "@/components/admin/topup-user-form"

function formatXu(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

interface Profile {
  id: string
  email: string | null
  full_name: string | null
  xu_balance: number
  frozen_xu: number
  role: string
  created_at: string
}

export default async function AdminUsersPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch all users
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  // Stats
  const totalXu = users?.reduce((sum, u) => sum + u.xu_balance + u.frozen_xu, 0) || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <HugeiconsIcon icon={Users} className="h-6 w-6 text-primary" />
          </div>
          Quản lý người dùng
        </h1>
        <p className="text-muted-foreground mt-2">
          Xem danh sách và nạp Xu cho người dùng.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <HugeiconsIcon icon={Users} className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{users?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Xu trong hệ thống</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <HugeiconsIcon icon={Coins} className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-primary">{formatXu(totalXu)}</div>
          </CardContent>
        </Card>

        <Card className="group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
          <CardHeader className="relative">
            <CardTitle className="text-sm font-medium">Nạp Xu nhanh</CardTitle>
            <CardDescription>Cộng Xu cho người dùng theo email</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <TopUpUserForm />
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card className="group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
        <CardHeader className="relative">
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>
            Tất cả người dùng đã đăng ký
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          {users && users.length > 0 ? (
            <div className="space-y-3">
              {users.map((u: Profile) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-background hover:bg-muted/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {u.full_name?.charAt(0).toUpperCase() || u.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {u.full_name || 'Chưa cập nhật'}
                        {u.role === 'admin' && (
                          <Badge variant="outline" className="text-xs border-red-200 text-red-600 rounded-full">Admin</Badge>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <HugeiconsIcon icon={Mail} className="h-3 w-3" />
                        {u.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-medium text-primary">{formatXu(u.xu_balance)} Xu</p>
                      {u.frozen_xu > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Đang giữ: {formatXu(u.frozen_xu)}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <HugeiconsIcon icon={Calendar} className="h-3 w-3" />
                        {formatDate(u.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <HugeiconsIcon icon={Users} className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p>Chưa có người dùng nào</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
