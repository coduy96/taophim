# Platform Payment Analytics — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Nền tảng thanh toán" section to `/admin/analytics` showing which platform (iOS / Android / Desktop) contributes most paying users and Xu purchased.

**Architecture:** Pure computation function in `analytics.ts` joins paying users from `payment_requests` with their most-frequent OS from `login_logs`. Result is passed to a new Client Component that renders a donut chart + summary table. No new Supabase queries needed — both datasets are already fetched by the analytics page.

**Tech Stack:** TypeScript, Recharts (PieChart/Cell/Tooltip — already installed), shadcn/ui Card, Tailwind CSS 4

---

### Task 1: Add `computePlatformPaymentBreakdown` to analytics.ts

**Files:**
- Modify: `src/lib/analytics.ts` (append after line 548)

**Step 1: Add the return type interface and function**

Append the following to the end of `src/lib/analytics.ts`:

```typescript
// --- Platform Payment Breakdown ---

export type PlatformKey = 'iOS' | 'Android' | 'Desktop'

export interface PlatformPaymentStat {
  platform: PlatformKey
  user_count: number
  percentage: number   // % of total paying users
  total_xu: number
}

export function computePlatformPaymentBreakdown(
  paymentRequests: PaymentRequestData[],
  loginLogs: LoginLogData[]
): PlatformPaymentStat[] {
  // 1. Collect paying users and their total Xu
  const payingUsers = new Map<string, number>() // user_id -> total_xu
  for (const pr of paymentRequests) {
    if (pr.status !== 'paid') continue
    payingUsers.set(pr.user_id, (payingUsers.get(pr.user_id) || 0) + pr.amount)
  }

  if (payingUsers.size === 0) {
    return [
      { platform: 'iOS', user_count: 0, percentage: 0, total_xu: 0 },
      { platform: 'Android', user_count: 0, percentage: 0, total_xu: 0 },
      { platform: 'Desktop', user_count: 0, percentage: 0, total_xu: 0 },
    ]
  }

  // 2. For each paying user, find their most frequent os_name from login_logs
  const userLogs = new Map<string, LoginLogData[]>()
  for (const log of loginLogs) {
    if (!payingUsers.has(log.user_id)) continue
    const list = userLogs.get(log.user_id) || []
    list.push(log)
    userLogs.set(log.user_id, list)
  }

  function getMostFrequentOs(logs: LoginLogData[]): string | null {
    const counts = new Map<string, number>()
    for (const log of logs) {
      const key = log.os_name || 'Unknown'
      counts.set(key, (counts.get(key) || 0) + 1)
    }
    let best: string | null = null
    let bestCount = 0
    for (const [os, count] of counts) {
      if (count > bestCount) { best = os; bestCount = count }
    }
    return best
  }

  function classifyPlatform(logs: LoginLogData[]): PlatformKey {
    if (logs.length === 0) return 'Desktop'
    const os = getMostFrequentOs(logs)
    if (os === 'iOS') return 'iOS'
    if (os === 'Android') return 'Android'
    return 'Desktop'
  }

  // 3. Aggregate per platform
  const stats: Record<PlatformKey, { user_count: number; total_xu: number }> = {
    iOS: { user_count: 0, total_xu: 0 },
    Android: { user_count: 0, total_xu: 0 },
    Desktop: { user_count: 0, total_xu: 0 },
  }

  for (const [userId, totalXu] of payingUsers) {
    const logs = userLogs.get(userId) || []
    const platform = classifyPlatform(logs)
    stats[platform].user_count++
    stats[platform].total_xu += totalXu
  }

  const total = payingUsers.size
  const platforms: PlatformKey[] = ['iOS', 'Android', 'Desktop']
  return platforms.map(p => ({
    platform: p,
    user_count: stats[p].user_count,
    percentage: total > 0 ? (stats[p].user_count / total) * 100 : 0,
    total_xu: stats[p].total_xu,
  }))
}
```

**Step 2: Verify TypeScript compiles cleanly**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/lib/analytics.ts
git commit -m "feat: add computePlatformPaymentBreakdown to analytics"
```

---

### Task 2: Create the PlatformPaymentBreakdown component

**Files:**
- Create: `src/components/admin/analytics/platform-payment-breakdown.tsx`

**Step 1: Write the component**

```typescript
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts"
import type { PlatformPaymentStat } from "@/lib/analytics"

const PLATFORM_COLORS: Record<string, string> = {
  iOS: "#3b82f6",       // blue
  Android: "#22c55e",   // green
  Desktop: "#8b5cf6",   // purple
}

export function PlatformPaymentBreakdown({ stats }: { stats: PlatformPaymentStat[] }) {
  const totalPayingUsers = stats.reduce((sum, s) => sum + s.user_count, 0)

  const chartData = stats
    .filter(s => s.user_count > 0)
    .map(s => ({
      name: s.platform,
      value: s.user_count,
      fill: PLATFORM_COLORS[s.platform] || "#94a3b8",
    }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nền tảng thanh toán</CardTitle>
        <CardDescription>
          Phân bổ {totalPayingUsers} người dùng đã nạp Xu theo nền tảng
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {totalPayingUsers > 0 ? (
          <>
            {/* Donut chart */}
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`${value} người`, 'Đã nạp Xu']}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Summary table */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Chi tiết</p>
              <div className="divide-y divide-border rounded-lg border">
                <div className="grid grid-cols-3 px-3 py-2 text-xs font-medium text-muted-foreground">
                  <span>Nền tảng</span>
                  <span className="text-center">Người dùng</span>
                  <span className="text-right">Tổng Xu</span>
                </div>
                {stats.map(s => (
                  <div key={s.platform} className="grid grid-cols-3 items-center px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: PLATFORM_COLORS[s.platform] }}
                      />
                      <span>{s.platform}</span>
                    </div>
                    <div className="text-center">
                      <span className="font-medium">{s.user_count}</span>
                      <span className="text-muted-foreground ml-1 text-xs">
                        ({s.percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="text-right font-medium">
                      {s.total_xu.toLocaleString('vi-VN')} Xu
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Chưa có dữ liệu thanh toán
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

**Step 2: Verify TypeScript compiles cleanly**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/components/admin/analytics/platform-payment-breakdown.tsx
git commit -m "feat: add PlatformPaymentBreakdown component"
```

---

### Task 3: Wire into the analytics page

**Files:**
- Modify: `src/app/admin/analytics/page.tsx`

**Step 1: Add import for the new function and component**

In `src/app/admin/analytics/page.tsx`, add to the analytics imports block (around line 6–17):

```typescript
  computePlatformPaymentBreakdown,
  type PlatformPaymentStat,
```

And add the component import below line 24:

```typescript
import { PlatformPaymentBreakdown } from "@/components/admin/analytics/platform-payment-breakdown"
```

**Step 2: Call the computation (after line 76)**

After `const deviceAnalytics = computeDeviceAnalytics(loginLogs)`, add:

```typescript
  const platformPayment = computePlatformPaymentBreakdown(paymentRequests, loginLogs)
```

**Step 3: Render the component**

After the `<DeviceBreakdown>` section (around line 103), add the new component in a grid alongside the existing Device Breakdown card. Replace:

```tsx
      {/* Device Breakdown */}
      <DeviceBreakdown analytics={deviceAnalytics} />
```

With:

```tsx
      {/* Device Breakdown + Platform Payment */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <DeviceBreakdown analytics={deviceAnalytics} />
        <PlatformPaymentBreakdown stats={platformPayment} />
      </div>
```

**Step 4: Verify TypeScript compiles cleanly**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 5: Visual verification**

Run: `npm run dev`

Navigate to: `http://localhost:3000/admin/analytics`

Check:
- "Nền tảng thanh toán" card appears beside "Thiết bị truy cập"
- Donut chart renders with iOS / Android / Desktop slices (or empty state if no paid users)
- Table shows platform name, user count with %, and total Xu

**Step 6: Commit**

```bash
git add src/app/admin/analytics/page.tsx
git commit -m "feat: add platform payment breakdown to admin analytics"
```

---

## Done

All 3 tasks complete. The feature is live at `/admin/analytics`.
