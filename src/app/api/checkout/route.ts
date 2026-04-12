import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { CartItem } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const { items } = (await req.json()) as { items: CartItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate stock for each item
    let totalAmount = 0;
    for (const item of items) {
      const { data: product } = await supabaseAdmin
        .from("products")
        .select("remaining_quantity, name, price")
        .eq("id", item.productId)
        .single();

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.name}` },
          { status: 400 }
        );
      }

      if (product.remaining_quantity < item.quantity) {
        return NextResponse.json(
          {
            error: `${product.name} only has ${product.remaining_quantity} left`,
          },
          { status: 400 }
        );
      }

      totalAmount += product.price * item.quantity;
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      notes: {
        items: JSON.stringify(
          items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            size: i.size,
          }))
        ),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
