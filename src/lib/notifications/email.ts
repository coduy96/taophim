// Email notification service using Resend

import { Resend } from 'resend'

let resendClient: Resend | null = null

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, email notifications disabled')
    return null
  }

  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }

  return resendClient
}

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  const client = getResendClient()
  if (!client) {
    return false
  }

  const fromEmail = process.env.EMAIL_FROM || 'Taophim <noreply@taophim.com>'

  try {
    const { error } = await client.emails.send({
      from: fromEmail,
      to: params.to,
      subject: params.subject,
      html: params.html,
    })

    if (error) {
      console.error('Resend error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}

/**
 * Send order completed email notification
 */
export async function sendOrderCompletedEmail(params: {
  email: string
  userName: string | null
  serviceName: string
  videoUrl: string
  orderId: string
}): Promise<boolean> {
  const { email, userName, serviceName, videoUrl, orderId } = params
  const displayName = userName || 'Quý khách'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taophim.com'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #18181b; font-size: 24px; margin: 0;">Video của bạn đã sẵn sàng!</h1>
      </div>

      <p style="color: #3f3f46; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Xin chào ${displayName},
      </p>

      <p style="color: #3f3f46; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Đơn hàng <strong>${serviceName}</strong> của bạn đã được xử lý thành công. Video đã sẵn sàng để tải xuống.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${videoUrl}"
           style="display: inline-block; background: #18181b; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500; font-size: 16px;">
          Tải video
        </a>
      </div>

      <p style="color: #71717a; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        Hoặc xem chi tiết đơn hàng tại:
        <a href="${siteUrl}/dashboard/orders" style="color: #18181b;">Quản lý đơn hàng</a>
      </p>

      <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;">

      <p style="color: #a1a1aa; font-size: 12px; text-align: center; margin: 0;">
        Mã đơn hàng: ${orderId}<br>
        <a href="${siteUrl}" style="color: #a1a1aa;">Taophim.com</a> - Tạo video AI chuyên nghiệp
      </p>
    </div>
  </div>
</body>
</html>
`

  return sendEmail({
    to: email,
    subject: `Video "${serviceName}" đã sẵn sàng - Taophim`,
    html,
  })
}

/**
 * Send order cancelled/failed email notification
 */
export async function sendOrderCancelledEmail(params: {
  email: string
  userName: string | null
  serviceName: string
  reason: string
  orderId: string
}): Promise<boolean> {
  const { email, userName, serviceName, reason, orderId } = params
  const displayName = userName || 'Quý khách'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taophim.com'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #dc2626; font-size: 24px; margin: 0;">Đơn hàng không thành công</h1>
      </div>

      <p style="color: #3f3f46; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Xin chào ${displayName},
      </p>

      <p style="color: #3f3f46; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Rất tiếc, đơn hàng <strong>${serviceName}</strong> của bạn không thể hoàn thành.
      </p>

      <div style="background: #fef2f2; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #991b1b; font-size: 14px; margin: 0;">
          <strong>Lý do:</strong> ${reason}
        </p>
      </div>

      <p style="color: #3f3f46; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Xu đã được hoàn trả vào tài khoản của bạn. Bạn có thể thử lại hoặc liên hệ hỗ trợ nếu cần giúp đỡ.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${siteUrl}/dashboard/services"
           style="display: inline-block; background: #18181b; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500; font-size: 16px;">
          Thử lại
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;">

      <p style="color: #a1a1aa; font-size: 12px; text-align: center; margin: 0;">
        Mã đơn hàng: ${orderId}<br>
        <a href="${siteUrl}" style="color: #a1a1aa;">Taophim.com</a> - Tạo video AI chuyên nghiệp
      </p>
    </div>
  </div>
</body>
</html>
`

  return sendEmail({
    to: email,
    subject: `Đơn hàng "${serviceName}" không thành công - Taophim`,
    html,
  })
}
