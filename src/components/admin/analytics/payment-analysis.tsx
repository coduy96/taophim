"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import type { PaymentAnalysis as PaymentAnalysisType } from "@/lib/analytics"

function formatVnd(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + "đ"
}

function formatXu(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

export function PaymentAnalysis({ analysis }: { analysis: PaymentAnalysisType }) {
  const chartData = [
    { name: "Thành công", count: analysis.successfulPayments, fill: "#22c55e" },
    { name: "Đã hủy", count: analysis.cancelledPayments, fill: "#ef4444" },
    { name: "Đang chờ", count: analysis.pendingPayments, fill: "#eab308" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân tích thanh toán</CardTitle>
        <CardDescription>Thống kê các giao dịch thanh toán qua PayOS</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Tổng yêu cầu</p>
            <p className="text-xl font-bold">{analysis.totalAttempts}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Tỷ lệ thành công</p>
            <p className="text-xl font-bold text-green-600">{analysis.successRate.toFixed(1)}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Doanh thu VND</p>
            <p className="text-xl font-bold">{formatVnd(analysis.totalRevenueVnd)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">TB mỗi giao dịch</p>
            <p className="text-xl font-bold">{formatXu(Math.round(analysis.avgPaymentXu))} Xu</p>
          </div>
        </div>

        {/* Chart */}
        {analysis.totalAttempts > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} className="fill-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" name="Số lượng" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Chưa có giao dịch thanh toán nào
          </div>
        )}
      </CardContent>
    </Card>
  )
}
