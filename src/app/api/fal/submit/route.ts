// FAL Job Submission API Route
// Called after order creation to submit the job to FAL

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { submitFalJob } from '@/lib/fal/submit-job'
import { isFalSupportedService } from '@/lib/fal/mappers'
import { OrderUserInputs } from '@/lib/fal/types'

interface SubmitRequest {
  orderId: string
  serviceSlug: string
  userInputs: OrderUserInputs
}

export async function POST(request: Request) {
  try {
    // Verify user is authenticated
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body: SubmitRequest = await request.json()
    const { orderId, serviceSlug, userInputs } = body

    if (!orderId || !serviceSlug || !userInputs) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, serviceSlug, userInputs' },
        { status: 400 }
      )
    }

    // Check if service supports FAL processing
    if (!isFalSupportedService(serviceSlug)) {
      return NextResponse.json(
        { error: 'Service does not support automated processing' },
        { status: 400 }
      )
    }

    // Verify the order belongs to the user
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, user_id, status')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - order belongs to another user' },
        { status: 403 }
      )
    }

    // Only allow submitting pending orders
    if (order.status !== 'pending') {
      return NextResponse.json(
        { error: `Order is already ${order.status}` },
        { status: 400 }
      )
    }

    // Submit to FAL
    const result = await submitFalJob(orderId, serviceSlug, userInputs)

    if (!result.success) {
      console.error('FAL submission failed:', result.error)
      return NextResponse.json(
        { error: result.error || 'Failed to submit job' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      requestId: result.requestId,
    })
  } catch (error) {
    console.error('FAL submit error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
