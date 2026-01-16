import { createClient } from "@/lib/supabase/server";
import { payOS } from "@/lib/payos";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount: xuAmount, returnUrl, cancelUrl } = body;

    // 1 Xu = 1000 VND
    const amountVND = xuAmount * 1000;

    if (!xuAmount || xuAmount < 99) {
      return NextResponse.json({ error: "Invalid amount (min 99 Xu)" }, { status: 400 });
    }

    // Generate Order Code (using timestamp + random to minimize collision)
    // PayOS requires integer orderCode. Max safe integer is 9x10^15.
    // Date.now() is 1.7x10^12. We can add 3 random digits.
    const orderCode = Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);

    // Create record in DB - Store Xu amount
    // Note: payment_requests table exists but isn't in generated types yet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await (supabase as any)
      .from('payment_requests')
      .insert({
        user_id: user.id,
        amount: xuAmount, // Store Xu
        payos_order_code: orderCode,
        status: 'pending'
      });

    if (dbError) {
      console.error("DB Error:", dbError);
      return NextResponse.json({ error: "Failed to create payment request" }, { status: 500 });
    }

    // Create PayOS Link - Use VND amount
    const paymentLinkResponse = await payOS.paymentRequests.create({
      orderCode: orderCode,
      amount: amountVND,
      description: `Nap ${xuAmount} Xu`,
      returnUrl: returnUrl,
      cancelUrl: cancelUrl,
      items: [
        {
          name: "Xu",
          quantity: xuAmount,
          price: 1000 // 1 Xu = 1000 VND
        }
      ]
    });

    return NextResponse.json({
      checkoutUrl: paymentLinkResponse.checkoutUrl,
      orderCode: orderCode // Return this if frontend needs it
    });

  } catch (error: unknown) {
    console.error("Payment Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
