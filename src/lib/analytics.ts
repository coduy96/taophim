// Pure computation functions for admin analytics
// No Supabase dependency — accepts raw data, returns computed results

export interface ProfileData {
  id: string
  email: string | null
  full_name: string | null
  xu_balance: number
  frozen_xu: number
  created_at: string
  role: string
}

export interface OrderData {
  id: string
  user_id: string
  status: "pending" | "processing" | "completed" | "cancelled"
  total_cost: number
  created_at: string
  updated_at: string
  service_id: string
}

export interface TransactionData {
  id: string
  user_id: string
  type: "deposit" | "expense" | "refund"
  amount: number
  created_at: string
  order_id: string | null
}

export interface PaymentRequestData {
  id: string
  user_id: string
  amount: number
  amount_vnd?: number
  status: string
  created_at: string
  updated_at: string
}

export interface LoginLogData {
  id: string
  user_id: string
  device_type: 'mobile' | 'tablet' | 'desktop'
  browser_name: string | null
  os_name: string | null
  created_at: string
}

// --- KPIs ---

export interface KPIs {
  totalUsers: number
  paidUsers: number
  conversionRate: number
  totalRevenueXu: number
  avgDaysToFirstPayment: number | null
  completedOrders: number
}

export function computeKPIs(
  profiles: ProfileData[],
  orders: OrderData[],
  transactions: TransactionData[],
  paymentRequests: PaymentRequestData[]
): KPIs {
  const totalUsers = profiles.filter(p => p.role !== 'admin').length

  // Users who have at least one paid payment request
  const paidUserIds = new Set(
    paymentRequests.filter(pr => pr.status === 'paid').map(pr => pr.user_id)
  )
  // Also include users with deposit transactions (manual top-ups)
  transactions.filter(t => t.type === 'deposit').forEach(t => paidUserIds.add(t.user_id))
  const paidUsers = paidUserIds.size

  const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0

  const totalRevenueXu = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const completedOrders = orders.filter(o => o.status === 'completed').length

  // Avg days from registration to first payment
  const daysToFirst: number[] = []
  for (const userId of paidUserIds) {
    const profile = profiles.find(p => p.id === userId)
    if (!profile) continue
    const firstPayment = paymentRequests
      .filter(pr => pr.user_id === userId && pr.status === 'paid')
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]
    const firstDeposit = transactions
      .filter(t => t.user_id === userId && t.type === 'deposit')
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]

    const firstPayDate = [firstPayment?.created_at, firstDeposit?.created_at]
      .filter(Boolean)
      .sort()[0]

    if (firstPayDate) {
      const regDate = new Date(profile.created_at).getTime()
      const payDate = new Date(firstPayDate).getTime()
      daysToFirst.push((payDate - regDate) / (1000 * 60 * 60 * 24))
    }
  }

  const avgDaysToFirstPayment = daysToFirst.length > 0
    ? daysToFirst.reduce((a, b) => a + b, 0) / daysToFirst.length
    : null

  return { totalUsers, paidUsers, conversionRate, totalRevenueXu, avgDaysToFirstPayment, completedOrders }
}

// --- Conversion Funnel ---

export interface FunnelStep {
  label: string
  count: number
  percentage: number
  dropOff: number | null
}

export function computeFunnel(
  profiles: ProfileData[],
  orders: OrderData[],
  transactions: TransactionData[],
  paymentRequests: PaymentRequestData[]
): FunnelStep[] {
  const nonAdminProfiles = profiles.filter(p => p.role !== 'admin')
  const registered = nonAdminProfiles.length

  // Attempted payment: has any payment_request OR deposit transaction
  const attemptedPaymentIds = new Set([
    ...paymentRequests.map(pr => pr.user_id),
    ...transactions.filter(t => t.type === 'deposit').map(t => t.user_id),
  ])
  const attemptedPayment = attemptedPaymentIds.size

  // Paid: has paid payment_request OR deposit transaction
  const paidIds = new Set([
    ...paymentRequests.filter(pr => pr.status === 'paid').map(pr => pr.user_id),
    ...transactions.filter(t => t.type === 'deposit').map(t => t.user_id),
  ])
  const paid = paidIds.size

  // Created order
  const orderedIds = new Set(orders.map(o => o.user_id))
  const createdOrder = orderedIds.size

  // Completed order
  const completedIds = new Set(orders.filter(o => o.status === 'completed').map(o => o.user_id))
  const completedOrder = completedIds.size

  // Repeat: 2+ completed orders
  const userCompletedCounts = new Map<string, number>()
  orders.filter(o => o.status === 'completed').forEach(o => {
    userCompletedCounts.set(o.user_id, (userCompletedCounts.get(o.user_id) || 0) + 1)
  })
  const repeat = [...userCompletedCounts.values()].filter(c => c >= 2).length

  const steps = [
    { label: "Đăng ký", count: registered },
    { label: "Thử nạp Xu", count: attemptedPayment },
    { label: "Nạp thành công", count: paid },
    { label: "Tạo đơn hàng", count: createdOrder },
    { label: "Hoàn thành đơn", count: completedOrder },
    { label: "Quay lại", count: repeat },
  ]

  return steps.map((step, i) => ({
    label: step.label,
    count: step.count,
    percentage: registered > 0 ? (step.count / registered) * 100 : 0,
    dropOff: i > 0 ? steps[i - 1].count - step.count : null,
  }))
}

// --- User Segments ---

export type SegmentKey = 'loyal' | 'completed' | 'created_orders' | 'has_balance' | 'attempted_payment' | 'inactive'

export interface UserSegmentInfo {
  id: string
  email: string | null
  full_name: string | null
  created_at: string
  daysSinceSignup: number
  xu_balance: number
}

export interface UserSegment {
  key: SegmentKey
  label: string
  description: string
  color: string
  count: number
  percentage: number
  users: UserSegmentInfo[]
}

export function segmentUsers(
  profiles: ProfileData[],
  orders: OrderData[],
  transactions: TransactionData[],
  paymentRequests: PaymentRequestData[]
): UserSegment[] {
  const nonAdminProfiles = profiles.filter(p => p.role !== 'admin')
  const total = nonAdminProfiles.length
  const now = Date.now()

  // Precompute per-user data
  const userOrders = new Map<string, OrderData[]>()
  orders.forEach(o => {
    const list = userOrders.get(o.user_id) || []
    list.push(o)
    userOrders.set(o.user_id, list)
  })

  const userPaymentRequests = new Map<string, PaymentRequestData[]>()
  paymentRequests.forEach(pr => {
    const list = userPaymentRequests.get(pr.user_id) || []
    list.push(pr)
    userPaymentRequests.set(pr.user_id, list)
  })

  const userDeposits = new Set(
    transactions.filter(t => t.type === 'deposit').map(t => t.user_id)
  )

  const segments: Map<SegmentKey, UserSegmentInfo[]> = new Map([
    ['loyal', []],
    ['completed', []],
    ['created_orders', []],
    ['has_balance', []],
    ['attempted_payment', []],
    ['inactive', []],
  ])

  for (const profile of nonAdminProfiles) {
    const info: UserSegmentInfo = {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      created_at: profile.created_at,
      daysSinceSignup: Math.floor((now - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)),
      xu_balance: profile.xu_balance,
    }

    const userOrdList = userOrders.get(profile.id) || []
    const completedCount = userOrdList.filter(o => o.status === 'completed').length
    const prs = userPaymentRequests.get(profile.id) || []
    const hasPaidPR = prs.some(pr => pr.status === 'paid')
    const hasDeposit = userDeposits.has(profile.id)
    const hasAnyPR = prs.length > 0

    if (completedCount >= 2) {
      segments.get('loyal')!.push(info)
    } else if (completedCount === 1) {
      segments.get('completed')!.push(info)
    } else if (userOrdList.length > 0) {
      segments.get('created_orders')!.push(info)
    } else if (profile.xu_balance > 0 || hasPaidPR || hasDeposit) {
      segments.get('has_balance')!.push(info)
    } else if (hasAnyPR) {
      segments.get('attempted_payment')!.push(info)
    } else {
      segments.get('inactive')!.push(info)
    }
  }

  const segmentMeta: { key: SegmentKey; label: string; description: string; color: string }[] = [
    { key: 'loyal', label: 'Khách trung thành', description: '2+ đơn hoàn thành', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
    { key: 'completed', label: 'Đã hoàn thành', description: '1 đơn hoàn thành', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
    { key: 'created_orders', label: 'Đã tạo đơn', description: 'Có đơn hàng nhưng chưa hoàn thành', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
    { key: 'has_balance', label: 'Đã nạp Xu', description: 'Đã nạp tiền nhưng chưa đặt đơn', color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30' },
    { key: 'attempted_payment', label: 'Đã thử nạp', description: 'Tạo yêu cầu nạp nhưng chưa thanh toán', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
    { key: 'inactive', label: 'Chưa hoạt động', description: 'Đăng ký nhưng chưa làm gì', color: 'text-gray-600 bg-gray-100 dark:bg-gray-900/30' },
  ]

  return segmentMeta.map(meta => {
    const users = segments.get(meta.key)!
    return {
      ...meta,
      count: users.length,
      percentage: total > 0 ? (users.length / total) * 100 : 0,
      users: users.sort((a, b) => b.daysSinceSignup - a.daysSinceSignup),
    }
  })
}

// --- Weekly Timeline ---

export interface WeeklyDataPoint {
  week: string
  signups: number
  payments: number
}

export function computeWeeklyTimeline(
  profiles: ProfileData[],
  paymentRequests: PaymentRequestData[],
  transactions: TransactionData[]
): WeeklyDataPoint[] {
  const nonAdminProfiles = profiles.filter(p => p.role !== 'admin')

  // Get date range
  const allDates = nonAdminProfiles.map(p => new Date(p.created_at))
  if (allDates.length === 0) return []

  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())))
  const maxDate = new Date() // up to today

  // Generate weeks from minDate to maxDate
  const weeks: Map<string, { signups: number; payments: number }> = new Map()

  function getWeekKey(date: Date): string {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    d.setDate(diff)
    return d.toISOString().split('T')[0]
  }

  // Initialize all weeks in range
  const current = new Date(getWeekKey(minDate))
  const end = new Date(getWeekKey(maxDate))
  while (current <= end) {
    weeks.set(current.toISOString().split('T')[0], { signups: 0, payments: 0 })
    current.setDate(current.getDate() + 7)
  }

  // Count signups per week
  nonAdminProfiles.forEach(p => {
    const key = getWeekKey(new Date(p.created_at))
    const entry = weeks.get(key)
    if (entry) entry.signups++
  })

  // Count payments per week (paid payment_requests + deposit transactions)
  paymentRequests.filter(pr => pr.status === 'paid').forEach(pr => {
    const key = getWeekKey(new Date(pr.created_at))
    const entry = weeks.get(key)
    if (entry) entry.payments++
  })
  transactions.filter(t => t.type === 'deposit').forEach(t => {
    const key = getWeekKey(new Date(t.created_at))
    const entry = weeks.get(key)
    if (entry) entry.payments++
  })

  return [...weeks.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, data]) => ({
      week: new Date(week).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      ...data,
    }))
}

// --- User Journey Events ---

export interface JourneyEvent {
  date: string
  type: 'signup' | 'payment_attempt' | 'payment_success' | 'deposit' | 'order_created' | 'order_completed' | 'order_cancelled' | 'refund'
  label: string
  detail: string | null
}

export function computeUserJourneyEvents(
  userId: string,
  profiles: ProfileData[],
  orders: OrderData[],
  transactions: TransactionData[],
  paymentRequests: PaymentRequestData[]
): JourneyEvent[] {
  const events: JourneyEvent[] = []

  const profile = profiles.find(p => p.id === userId)
  if (profile) {
    events.push({
      date: profile.created_at,
      type: 'signup',
      label: 'Đăng ký tài khoản',
      detail: profile.email,
    })
  }

  // Payment requests
  paymentRequests.filter(pr => pr.user_id === userId).forEach(pr => {
    if (pr.status === 'paid') {
      events.push({
        date: pr.updated_at || pr.created_at,
        type: 'payment_success',
        label: 'Nạp Xu thành công',
        detail: `${pr.amount} Xu`,
      })
    } else {
      events.push({
        date: pr.created_at,
        type: 'payment_attempt',
        label: pr.status === 'cancelled' ? 'Hủy nạp Xu' : 'Tạo yêu cầu nạp',
        detail: `${pr.amount} Xu — ${pr.status}`,
      })
    }
  })

  // Transactions (deposits only — orders tracked separately)
  transactions.filter(t => t.user_id === userId && t.type === 'deposit').forEach(t => {
    events.push({
      date: t.created_at,
      type: 'deposit',
      label: 'Nạp Xu (admin)',
      detail: `+${t.amount} Xu`,
    })
  })

  transactions.filter(t => t.user_id === userId && t.type === 'refund').forEach(t => {
    events.push({
      date: t.created_at,
      type: 'refund',
      label: 'Hoàn Xu',
      detail: `+${t.amount} Xu`,
    })
  })

  // Orders
  orders.filter(o => o.user_id === userId).forEach(o => {
    events.push({
      date: o.created_at,
      type: 'order_created',
      label: 'Tạo đơn hàng',
      detail: `${o.total_cost} Xu — ${o.status}`,
    })
    if (o.status === 'completed') {
      events.push({
        date: o.updated_at || o.created_at,
        type: 'order_completed',
        label: 'Đơn hoàn thành',
        detail: `${o.total_cost} Xu`,
      })
    }
    if (o.status === 'cancelled') {
      events.push({
        date: o.updated_at || o.created_at,
        type: 'order_cancelled',
        label: 'Đơn bị hủy',
        detail: `${o.total_cost} Xu — hoàn lại`,
      })
    }
  })

  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

// --- Payment Analysis ---

export interface PaymentAnalysis {
  totalAttempts: number
  successfulPayments: number
  cancelledPayments: number
  pendingPayments: number
  successRate: number
  totalRevenueVnd: number
  avgPaymentXu: number
}

export function computePaymentAnalysis(
  paymentRequests: PaymentRequestData[]
): PaymentAnalysis {
  const totalAttempts = paymentRequests.length
  const successful = paymentRequests.filter(pr => pr.status === 'paid')
  const cancelled = paymentRequests.filter(pr => pr.status === 'cancelled')
  const pending = paymentRequests.filter(pr => pr.status === 'pending')

  const successRate = totalAttempts > 0 ? (successful.length / totalAttempts) * 100 : 0
  const totalRevenueVnd = successful.reduce((sum, pr) => sum + (pr.amount_vnd || 0), 0)
  const avgPaymentXu = successful.length > 0
    ? successful.reduce((sum, pr) => sum + pr.amount, 0) / successful.length
    : 0

  return {
    totalAttempts,
    successfulPayments: successful.length,
    cancelledPayments: cancelled.length,
    pendingPayments: pending.length,
    successRate,
    totalRevenueVnd,
    avgPaymentXu,
  }
}

// --- Device Analytics ---

export interface BreakdownItem {
  name: string
  count: number
  percentage: number
}

export interface DeviceAnalytics {
  totalLogins: number
  deviceBreakdown: BreakdownItem[]
  browserBreakdown: BreakdownItem[]
  osBreakdown: BreakdownItem[]
  uniqueUsersByDevice: { device: string; users: number }[]
}

export function computeDeviceAnalytics(
  loginLogs: LoginLogData[]
): DeviceAnalytics {
  const totalLogins = loginLogs.length

  function buildBreakdown(values: (string | null)[]): BreakdownItem[] {
    const counts = new Map<string, number>()
    for (const v of values) {
      const key = v || 'Không xác định'
      counts.set(key, (counts.get(key) || 0) + 1)
    }
    return [...counts.entries()]
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalLogins > 0 ? (count / totalLogins) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
  }

  const deviceBreakdown = buildBreakdown(loginLogs.map(l => l.device_type))
  const browserBreakdown = buildBreakdown(loginLogs.map(l => l.browser_name))
  const osBreakdown = buildBreakdown(loginLogs.map(l => l.os_name))

  // Unique users per device type
  const deviceUserSets = new Map<string, Set<string>>()
  for (const log of loginLogs) {
    const key = log.device_type
    if (!deviceUserSets.has(key)) deviceUserSets.set(key, new Set())
    deviceUserSets.get(key)!.add(log.user_id)
  }
  const uniqueUsersByDevice = [...deviceUserSets.entries()]
    .map(([device, users]) => ({ device, users: users.size }))
    .sort((a, b) => b.users - a.users)

  return { totalLogins, deviceBreakdown, browserBreakdown, osBreakdown, uniqueUsersByDevice }
}

