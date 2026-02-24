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
