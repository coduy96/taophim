"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts"
import type { DeviceAnalytics } from "@/lib/analytics"

const DEVICE_LABELS: Record<string, string> = {
  mobile: "Di động",
  tablet: "Máy tính bảng",
  desktop: "Máy tính",
}

const DEVICE_COLORS: Record<string, string> = {
  mobile: "#3b82f6",
  tablet: "#8b5cf6",
  desktop: "#22c55e",
}

const BROWSER_COLORS = ["#3b82f6", "#ef4444", "#eab308", "#22c55e", "#8b5cf6"]

export function DeviceBreakdown({ analytics }: { analytics: DeviceAnalytics }) {
  const chartData = analytics.deviceBreakdown.map(item => ({
    name: DEVICE_LABELS[item.name] || item.name,
    value: item.count,
    fill: DEVICE_COLORS[item.name] || "#94a3b8",
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thiết bị truy cập</CardTitle>
        <CardDescription>
          Phân tích thiết bị và trình duyệt từ {analytics.totalLogins} lượt đăng nhập
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {analytics.totalLogins > 0 ? (
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
                  formatter={(value) => [`${value} lượt`, 'Đăng nhập']}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Browser breakdown */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Trình duyệt</p>
              {analytics.browserBreakdown.slice(0, 5).map((item, i) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">
                      {item.count} ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: BROWSER_COLORS[i % BROWSER_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* OS breakdown */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Hệ điều hành</p>
              {analytics.osBreakdown.slice(0, 5).map((item) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="text-muted-foreground">
                    {item.count} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Chưa có dữ liệu đăng nhập
          </div>
        )}
      </CardContent>
    </Card>
  )
}
