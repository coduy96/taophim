import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnalyticsUpIcon as TrendingUp } from "@hugeicons/core-free-icons"
import {
  computeKPIs,
  computeFunnel,
  segmentUsers,
  computeWeeklyTimeline,
  computePaymentAnalysis,
  type ProfileData,
  type OrderData,
  type TransactionData,
  type PaymentRequestData,
} from "@/lib/analytics"
import { KPICards } from "@/components/admin/analytics/kpi-cards"
import { ConversionFunnel } from "@/components/admin/analytics/conversion-funnel"
import { UserSegmentsTable } from "@/components/admin/analytics/user-segments-table"
import { RegistrationTimelineChart } from "@/components/admin/analytics/registration-timeline-chart"
import { UserJourneyInspector } from "@/components/admin/analytics/user-journey-inspector"
import { PaymentAnalysis } from "@/components/admin/analytics/payment-analysis"

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check admin role
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Parallel data fetch
  const [profilesRes, ordersRes, transactionsRes, paymentRequestsRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, email, full_name, xu_balance, frozen_xu, created_at, role'),
    supabase
      .from('orders')
      .select('id, user_id, status, total_cost, created_at, service_id, updated_at'),
    supabase
      .from('transactions')
      .select('id, user_id, type, amount, created_at, order_id'),
    // payment_requests not in generated types — use any cast
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from('payment_requests')
      .select('id, user_id, amount, amount_vnd, status, created_at, updated_at'),
  ])

  const profiles: ProfileData[] = profilesRes.data || []
  const orders: OrderData[] = ordersRes.data || []
  const transactions: TransactionData[] = transactionsRes.data || []
  const paymentRequests: PaymentRequestData[] = paymentRequestsRes.data || []

  // Compute all analytics server-side
  const kpis = computeKPIs(profiles, orders, transactions, paymentRequests)
  const funnel = computeFunnel(profiles, orders, transactions, paymentRequests)
  const segments = segmentUsers(profiles, orders, transactions, paymentRequests)
  const timeline = computeWeeklyTimeline(profiles, paymentRequests, transactions)
  const paymentAnalysis = computePaymentAnalysis(paymentRequests)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <HugeiconsIcon icon={TrendingUp} className="h-6 w-6 text-primary" />
          </div>
          Phân tích chuyển đổi
        </h1>
        <p className="text-muted-foreground">
          Chẩn đoán vì sao người dùng chưa chuyển đổi thành khách hàng.
        </p>
      </div>

      {/* KPI Cards */}
      <KPICards kpis={kpis} />

      {/* Funnel + Payment Analysis side by side */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <ConversionFunnel funnel={funnel} />
        <PaymentAnalysis analysis={paymentAnalysis} />
      </div>

      {/* User Segments */}
      <UserSegmentsTable segments={segments} />

      {/* Timeline + Journey side by side */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <RegistrationTimelineChart data={timeline} />
        <UserJourneyInspector
          profiles={profiles}
          orders={orders}
          transactions={transactions}
          paymentRequests={paymentRequests}
        />
      </div>
    </div>
  )
}
