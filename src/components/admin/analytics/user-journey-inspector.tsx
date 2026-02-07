"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  computeUserJourneyEvents,
  type ProfileData,
  type OrderData,
  type TransactionData,
  type PaymentRequestData,
  type JourneyEvent,
} from "@/lib/analytics"

const eventStyles: Record<JourneyEvent['type'], { label: string; color: string }> = {
  signup: { label: "Đăng ký", color: "bg-primary/10 text-primary" },
  payment_attempt: { label: "Thử nạp", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  payment_success: { label: "Nạp OK", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  deposit: { label: "Admin nạp", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
  order_created: { label: "Tạo đơn", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  order_completed: { label: "Hoàn thành", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  order_cancelled: { label: "Hủy đơn", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  refund: { label: "Hoàn Xu", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface UserJourneyInspectorProps {
  profiles: ProfileData[]
  orders: OrderData[]
  transactions: TransactionData[]
  paymentRequests: PaymentRequestData[]
}

export function UserJourneyInspector({
  profiles,
  orders,
  transactions,
  paymentRequests,
}: UserJourneyInspectorProps) {
  const [search, setSearch] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const nonAdminProfiles = useMemo(
    () => profiles.filter(p => p.role !== 'admin'),
    [profiles]
  )

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return nonAdminProfiles.slice(0, 10)
    const q = search.toLowerCase()
    return nonAdminProfiles.filter(
      p =>
        p.email?.toLowerCase().includes(q) ||
        p.full_name?.toLowerCase().includes(q)
    ).slice(0, 20)
  }, [nonAdminProfiles, search])

  const journeyEvents = useMemo(() => {
    if (!selectedUserId) return []
    return computeUserJourneyEvents(selectedUserId, profiles, orders, transactions, paymentRequests)
  }, [selectedUserId, profiles, orders, transactions, paymentRequests])

  const selectedProfile = profiles.find(p => p.id === selectedUserId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hành trình người dùng</CardTitle>
        <CardDescription>Tìm kiếm và xem chi tiết timeline của từng người dùng</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Tìm theo email hoặc tên..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setSelectedUserId(null)
          }}
        />

        {!selectedUserId && (
          <div className="border rounded-2xl divide-y max-h-64 overflow-y-auto">
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left"
              >
                <div>
                  <span className="text-sm font-medium">{user.email || "—"}</span>
                  {user.full_name && (
                    <span className="text-xs text-muted-foreground ml-2">{user.full_name}</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Intl.NumberFormat('vi-VN').format(user.xu_balance)} Xu
                </span>
              </button>
            ))}
            {filteredUsers.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Không tìm thấy người dùng
              </div>
            )}
          </div>
        )}

        {selectedUserId && selectedProfile && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{selectedProfile.email}</p>
                <p className="text-sm text-muted-foreground">{selectedProfile.full_name || "Chưa có tên"}</p>
              </div>
              <button
                onClick={() => setSelectedUserId(null)}
                className="text-sm text-primary hover:underline"
              >
                Quay lại
              </button>
            </div>

            {journeyEvents.length > 0 ? (
              <div className="relative border-l-2 border-muted ml-3 space-y-4 pl-6 py-2">
                {journeyEvents.map((event, i) => {
                  const style = eventStyles[event.type]
                  return (
                    <div key={i} className="relative">
                      <div className="absolute -left-[1.9rem] top-1 w-3 h-3 rounded-full border-2 border-background bg-muted-foreground" />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`${style.color} border-0 text-xs`}>
                            {style.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(event.date)}
                          </span>
                        </div>
                        <p className="text-sm">{event.label}</p>
                        {event.detail && (
                          <p className="text-xs text-muted-foreground">{event.detail}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Chưa có hoạt động nào
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
