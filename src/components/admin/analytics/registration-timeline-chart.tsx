"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import type { WeeklyDataPoint } from "@/lib/analytics"

export function RegistrationTimelineChart({ data }: { data: WeeklyDataPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Đăng ký & thanh toán theo tuần</CardTitle>
        <CardDescription>So sánh lượng đăng ký và thanh toán theo thời gian</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="signups"
                name="Đăng ký"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="payments"
                name="Thanh toán"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Chưa có dữ liệu
          </div>
        )}
      </CardContent>
    </Card>
  )
}
