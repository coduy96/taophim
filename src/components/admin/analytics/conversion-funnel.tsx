"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FunnelStep } from "@/lib/analytics"

const stepColors = [
  "bg-primary",
  "bg-blue-500",
  "bg-green-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-purple-500",
]

export function ConversionFunnel({ funnel }: { funnel: FunnelStep[] }) {
  const maxCount = funnel[0]?.count || 1

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phễu chuyển đổi</CardTitle>
        <CardDescription>Hành trình từ đăng ký đến khách hàng trung thành</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {funnel.map((step, i) => {
          const widthPercent = maxCount > 0 ? Math.max((step.count / maxCount) * 100, 4) : 4

          return (
            <div key={step.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{step.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{step.count}</span>
                  <span className="text-xs text-muted-foreground">
                    ({step.percentage.toFixed(1)}%)
                  </span>
                  {step.dropOff !== null && step.dropOff > 0 && (
                    <span className="text-xs text-red-500">
                      -{step.dropOff}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-8 overflow-hidden">
                <div
                  className={`h-full rounded-full ${stepColors[i % stepColors.length]} transition-all duration-700 ease-out flex items-center px-3`}
                  style={{ width: `${widthPercent}%` }}
                >
                  {widthPercent > 15 && (
                    <span className="text-xs font-medium text-white truncate">
                      {step.percentage.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
