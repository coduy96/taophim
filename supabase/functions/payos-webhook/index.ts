import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { PayOS } from 'npm:@payos/node'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    
    // Initialize PayOS
    const payOS = new PayOS(
      Deno.env.get('PAYOS_CLIENT_ID') ?? '',
      Deno.env.get('PAYOS_API_KEY') ?? '',
      Deno.env.get('PAYOS_CHECKSUM_KEY') ?? ''
    )

    // Verify webhook signature
    // The verify method returns the data if signature is valid, or null/throws otherwise?
    // Based on types, it returns Promise<WebhookData>. It likely throws if signature invalid.
    let verifiedData;
    try {
        verifiedData = await payOS.webhooks.verify(body);
    } catch (e) {
        console.error("Signature verification failed:", e);
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
    
    // Check if payment was successful (code "00")
    if (verifiedData.code !== "00") {
       return new Response(JSON.stringify({ message: "Payment not successful" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Initialize Supabase Admin Client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const orderCode = verifiedData.orderCode
    const amountVND = verifiedData.amount

    // 1. Find the payment request
    const { data: paymentRequest, error: fetchError } = await supabaseClient
      .from('payment_requests')
      .select('*')
      .eq('payos_order_code', orderCode)
      .single()

    if (fetchError || !paymentRequest) {
      console.error("Payment Request not found:", orderCode)
      // Return 200 even if order not found to satisfy PayOS verification test
      // and to prevent retries for invalid orders
      return new Response(JSON.stringify({ message: "Order not found" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (paymentRequest.status === 'paid') {
      return new Response(JSON.stringify({ message: "Already paid" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Verify amount matches (allow some flexibility if needed, but strictly should match)
    // paymentRequest.amount is in Xu. verifiedData.amount is in VND.
    // 1 Xu = 1000 VND.
    if (paymentRequest.amount * 1000 !== amountVND) {
        console.warn(`Amount mismatch. Expected ${paymentRequest.amount * 1000} VND, got ${amountVND} VND`)
        // You might want to reject or proceed with caution. 
        // For now, let's update status to 'paid' but perhaps NOT top up full amount? 
        // Or assume it's valid if it's close? 
        // Safest is to fail or update only if matched.
        // Let's assume strict match for now.
        return new Response(JSON.stringify({ message: "Amount mismatch" }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400, // PayOS might retry
        })
    }

    // 2. Update payment request status
    const { error: updateError } = await supabaseClient
      .from('payment_requests')
      .update({ status: 'paid', updated_at: new Date().toISOString() })
      .eq('id', paymentRequest.id)

    if (updateError) throw updateError

    // 3. Top up user balance via RPC
    // We use paymentRequest.amount which is in Xu
    const { error: balanceError } = await supabaseClient.rpc('increment_xu', { 
      p_user_id: paymentRequest.user_id, 
      p_amount: paymentRequest.amount 
    })

    if (balanceError) {
      console.warn("RPC increment_xu failed, trying direct update", balanceError)
      // Fallback
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('xu_balance')
        .eq('id', paymentRequest.user_id)
        .single()
        
      if (profile) {
        await supabaseClient
          .from('profiles')
          .update({ xu_balance: (profile.xu_balance || 0) + paymentRequest.amount })
          .eq('id', paymentRequest.user_id)
      }
    }

    // 4. Create Transaction Record
    await supabaseClient.from('transactions').insert({
      user_id: paymentRequest.user_id,
      amount: paymentRequest.amount,
      type: 'deposit',
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
