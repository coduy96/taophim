// Notification types

export type NotificationType = 'order_completed' | 'order_cancelled' | 'order_processing' | 'system'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  data: Record<string, unknown>
  is_read: boolean
  created_at: string
}

export interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
}

export interface OrderCompletedData {
  orderId: string
  serviceName: string
  videoUrl: string
}

export interface OrderCancelledData {
  orderId: string
  serviceName: string
  reason: string
}
