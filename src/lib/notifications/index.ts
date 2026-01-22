// Notification service - combines email and in-app notifications

import { SupabaseClient } from '@supabase/supabase-js'
import { sendOrderCompletedEmail, sendOrderCancelledEmail } from './email'
import { createOrderCompletedNotification, createOrderCancelledNotification } from './in-app'

export * from './types'
export * from './email'
export * from './in-app'

interface OrderNotificationParams {
  supabase: SupabaseClient
  userId: string
  userEmail: string
  userName: string | null
  orderId: string
  serviceName: string
}

/**
 * Send all notifications for a completed order
 */
export async function notifyOrderCompleted(
  params: OrderNotificationParams & { videoUrl: string }
): Promise<void> {
  const { supabase, userId, userEmail, userName, orderId, serviceName, videoUrl } = params

  // Send both notifications in parallel
  await Promise.all([
    // In-app notification
    createOrderCompletedNotification(supabase, {
      userId,
      orderId,
      serviceName,
      videoUrl,
    }),

    // Email notification
    sendOrderCompletedEmail({
      email: userEmail,
      userName,
      serviceName,
      videoUrl,
      orderId,
    }),
  ])

  console.log('Notifications sent for completed order:', orderId)
}

/**
 * Send all notifications for a cancelled/failed order
 */
export async function notifyOrderCancelled(
  params: OrderNotificationParams & { reason: string }
): Promise<void> {
  const { supabase, userId, userEmail, userName, orderId, serviceName, reason } = params

  // Send both notifications in parallel
  await Promise.all([
    // In-app notification
    createOrderCancelledNotification(supabase, {
      userId,
      orderId,
      serviceName,
      reason,
    }),

    // Email notification
    sendOrderCancelledEmail({
      email: userEmail,
      userName,
      serviceName,
      reason,
      orderId,
    }),
  ])

  console.log('Notifications sent for cancelled order:', orderId)
}
