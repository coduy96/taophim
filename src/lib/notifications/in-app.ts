// In-app notification service

import { SupabaseClient } from '@supabase/supabase-js'
import { CreateNotificationParams } from './types'

/**
 * Create an in-app notification
 */
export async function createNotification(
  supabase: SupabaseClient,
  params: CreateNotificationParams
): Promise<boolean> {
  const { userId, type, title, message, data = {} } = params

  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      message,
      data,
      is_read: false,
    })

  if (error) {
    console.error('Failed to create notification:', error)
    return false
  }

  return true
}

/**
 * Create order completed notification
 */
export async function createOrderCompletedNotification(
  supabase: SupabaseClient,
  params: {
    userId: string
    orderId: string
    serviceName: string
    resultUrl: string
  }
): Promise<boolean> {
  return createNotification(supabase, {
    userId: params.userId,
    type: 'order_completed',
    title: 'Kết quả đã sẵn sàng!',
    message: `Đơn hàng ${params.serviceName} của bạn đã hoàn thành. Nhấn để xem kết quả.`,
    data: {
      orderId: params.orderId,
      serviceName: params.serviceName,
      resultUrl: params.resultUrl,
    },
  })
}

/**
 * Create order cancelled notification
 */
export async function createOrderCancelledNotification(
  supabase: SupabaseClient,
  params: {
    userId: string
    orderId: string
    serviceName: string
    reason: string
  }
): Promise<boolean> {
  return createNotification(supabase, {
    userId: params.userId,
    type: 'order_cancelled',
    title: 'Đơn hàng không thành công',
    message: `Đơn hàng ${params.serviceName} không thể hoàn thành. Xu đã được hoàn trả.`,
    data: {
      orderId: params.orderId,
      serviceName: params.serviceName,
      reason: params.reason,
    },
  })
}
