"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon as ChevronDown, ArrowUp01Icon as ChevronUp } from "@hugeicons/core-free-icons"
import type { UserSegment } from "@/lib/analytics"

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function UserSegmentsTable({ segments }: { segments: UserSegment[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân khúc người dùng</CardTitle>
        <CardDescription>Phân loại tất cả người dùng theo hành vi</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {segments.map((segment) => (
            <div key={segment.key} className="border rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === segment.key ? null : segment.key)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge className={`${segment.color} border-0`}>
                    {segment.count}
                  </Badge>
                  <div className="text-left">
                    <span className="font-medium">{segment.label}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {segment.description}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {segment.percentage.toFixed(1)}%
                  </span>
                  <HugeiconsIcon
                    icon={expanded === segment.key ? ChevronUp : ChevronDown}
                    className="h-4 w-4 text-muted-foreground"
                  />
                </div>
              </button>

              {expanded === segment.key && segment.users.length > 0 && (
                <div className="border-t px-4 pb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Tên</TableHead>
                        <TableHead>Ngày đăng ký</TableHead>
                        <TableHead className="text-right">Số ngày</TableHead>
                        <TableHead className="text-right">Xu</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {segment.users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-mono text-xs">
                            {user.email || "—"}
                          </TableCell>
                          <TableCell>{user.full_name || "—"}</TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                          <TableCell className="text-right">
                            {user.daysSinceSignup}d
                          </TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat('vi-VN').format(user.xu_balance)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {expanded === segment.key && segment.users.length === 0 && (
                <div className="border-t p-4 text-center text-sm text-muted-foreground">
                  Không có người dùng trong nhóm này
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
