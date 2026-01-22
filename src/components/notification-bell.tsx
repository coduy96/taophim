"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Notification02Icon as Bell,
  CheckmarkCircle02Icon as CheckCircle,
  Cancel01Icon as XCircle,
  Download01Icon as Download,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Notification, NotificationType } from "@/lib/notifications/types"

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Vừa xong"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
  return `${Math.floor(diffInSeconds / 86400)} ngày trước`
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "order_completed":
      return <HugeiconsIcon icon={CheckCircle} className="h-4 w-4 text-green-500" />
    case "order_cancelled":
      return <HugeiconsIcon icon={XCircle} className="h-4 w-4 text-red-500" />
    default:
      return <HugeiconsIcon icon={Bell} className="h-4 w-4 text-muted-foreground" />
  }
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications?limit=10")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch notifications on mount and when dropdown opens
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Refresh when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen, fetchNotifications])

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      })
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Failed to mark notifications as read:", error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      })
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <HugeiconsIcon icon={Bell} className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Thông báo</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Thông báo</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              Đánh dấu đã đọc
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Đang tải...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Chưa có thông báo nào
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start gap-1 p-3 cursor-pointer",
                  !notification.is_read && "bg-muted/50"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex w-full items-start gap-2">
                  {getNotificationIcon(notification.type as NotificationType)}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm truncate",
                      !notification.is_read && "font-medium"
                    )}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {formatTimeAgo(notification.created_at)}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                </div>

                {/* Action buttons for completed orders */}
                {notification.type === "order_completed" && typeof notification.data?.videoUrl === 'string' && (
                  <div className="flex gap-2 mt-2 w-full">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs flex-1"
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a
                        href={notification.data.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <HugeiconsIcon icon={Download} className="h-3 w-3 mr-1" />
                        Tải video
                      </a>
                    </Button>
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center">
          <Link href="/dashboard/orders" className="w-full text-center text-sm">
            Xem tất cả đơn hàng
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
