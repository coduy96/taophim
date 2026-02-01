import { createClient } from "@/lib/supabase/server";
import { payOS } from "@/lib/payos";
import { NextResponse } from "next/server";

// Server-side package definitions (source of truth)
const XU_PACKAGES = {
  starter: { slug: "starter", base_xu: 150, bonus_xu: 0, price_vnd: 150000 },
  popular: { slug: "popular", base_xu: 500, bonus_xu: 50, price_vnd: 500000 },
  pro: { slug: "pro", base_xu: 1500, bonus_xu: 300, price_vnd: 1500000 },
} as const;

type PackageSlug = keyof typeof XU_PACKAGES;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { package_slug, returnUrl, cancelUrl } = body;

    // Validate package exists
    if (!package_slug || !XU_PACKAGES[package_slug as PackageSlug]) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    const pkg = XU_PACKAGES[package_slug as PackageSlug];
    const totalXu = pkg.base_xu + pkg.bonus_xu;

    // Generate Order Code (using timestamp + random to minimize collision)
    // PayOS requires integer orderCode. Max safe integer is 9x10^15.
    // Date.now() is 1.7x10^12. We can add 3 random digits.
    const orderCode = Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);

    // Create record in DB - Store total Xu (base + bonus)
    // Note: payment_requests table exists but isn't in generated types yet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await (supabase as any)
      .from('payment_requests')
      .insert({
        user_id: user.id,
        amount: totalXu, // Store total Xu to credit (base + bonus)
        payos_order_code: orderCode,
        status: 'pending'
      });

    if (dbError) {
      console.error("DB Error:", dbError);
      return NextResponse.json({ error: "Failed to create payment request" }, { status: 500 });
    }

    // Create PayOS Link - Use VND price from package
    const description = pkg.bonus_xu > 0
      ? `Nap ${pkg.base_xu} + ${pkg.bonus_xu} Xu`
      : `Nap ${pkg.base_xu} Xu`;

    const paymentLinkResponse = await payOS.paymentRequests.create({
      orderCode: orderCode,
      amount: pkg.price_vnd,
      description: description,
      returnUrl: returnUrl,
      cancelUrl: cancelUrl,
      items: [
        {
          name: `Gói ${pkg.base_xu} Xu`,
          quantity: 1,
          price: pkg.price_vnd
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
