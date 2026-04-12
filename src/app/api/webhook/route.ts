import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      items,
    } = await req.json();

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Verify payment status with Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (payment.status !== "captured") {
      return NextResponse.json(
        { error: "Payment not captured" },
        { status: 400 }
      );
    }

    // Process each item: create order + reduce stock
    const parsedItems: { productId: string; quantity: number; size: string }[] =
      typeof items === "string" ? JSON.parse(items) : items;

    for (const item of parsedItems) {
      await supabaseAdmin.from("orders").insert({
        email: email || "unknown",
        product_id: item.productId,
        quantity: item.quantity,
        size: item.size,
        payment_status: "paid",
        stripe_session_id: razorpay_payment_id, // reusing column for razorpay payment id
      });

      const { data: product } = await supabaseAdmin
        .from("products")
        .select("remaining_quantity")
        .eq("id", item.productId)
        .single();

      if (product) {
        const newQty = Math.max(0, product.remaining_quantity - item.quantity);
        await supabaseAdmin
          .from("products")
          .update({ remaining_quantity: newQty })
          .eq("id", item.productId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
