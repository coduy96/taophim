import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserGroupIcon as Users,
  Coins01Icon as Coins,
  AnalyticsUpIcon as TrendingUp,
  CheckmarkCircle02Icon as CheckCircle,
  Time01Icon as Clock,
  UserIcon as UserCheck,
} from "@hugeicons/core-free-icons"
import type { KPIs } from "@/lib/analytics"

function formatXu(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

export function KPICards({ kpis }: { kpis: KPIs }) {
  const cards = [
    {
      title: "Tổng người dùng",
      value: kpis.totalUsers.toString(),
      subtitle: "Tài khoản đăng ký",
      icon: Users,
      gradient: "from-primary/5",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      valueColor: "",
    },
    {
      title: "Đã nạp tiền",
      value: kpis.paidUsers.toString(),
      subtitle: `${kpis.conversionRate.toFixed(1)}% tỷ lệ chuyển đổi`,
      icon: UserCheck,
      gradient: "from-green-500/5",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
      valueColor: "text-green-600",
    },
    {
      title: "Tỷ lệ chuyển đổi",
      value: `${kpis.conversionRate.toFixed(1)}%`,
      subtitle: `${kpis.paidUsers}/${kpis.totalUsers} người dùng`,
      icon: TrendingUp,
      gradient: "from-blue-500/5",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      valueColor: "text-blue-600",
    },
    {
      title: "Doanh thu (Xu)",
      value: `${formatXu(kpis.totalRevenueXu)} Xu`,
      subtitle: "Từ đơn hoàn thành",
      icon: Coins,
      gradient: "from-amber-500/5",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      valueColor: "text-amber-600",
    },
    {
      title: "Thời gian nạp đầu",
      value: kpis.avgDaysToFirstPayment !== null
        ? `${kpis.avgDaysToFirstPayment.toFixed(1)} ngày`
        : "—",
      subtitle: "Trung bình từ đăng ký → nạp",
      icon: Clock,
      gradient: "from-violet-500/5",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-500",
      valueColor: "text-violet-600",
    },
    {
      title: "Đơn hoàn thành",
      value: kpis.completedOrders.toString(),
      subtitle: "Đơn hàng đã giao",
      icon: CheckCircle,
      gradient: "from-emerald-500/5",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      valueColor: "text-emerald-600",
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title} className="group">
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`w-10 h-10 rounded-2xl ${card.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
              <HugeiconsIcon icon={card.icon} className={`h-5 w-5 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className={`text-2xl font-bold ${card.valueColor}`}>{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
