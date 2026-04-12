"use client";

import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { useCartStore, type CartItem } from "@/lib/store";
import { useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CartPage() {
  const { items, removeItem, clearCart, totalPrice } = useCartStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      // 1. Create Razorpay order
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();

      if (!data.orderId) {
        alert(data.error || "Checkout failed");
        setLoading(false);
        return;
      }

      // 2. Open Razorpay checkout modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "RAREDROP",
        description: "Limited Edition Streetwear",
        order_id: data.orderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // 3. Verify payment on server
          const verifyRes = await fetch("/api/webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              email: "customer@raredrop.in",
              items: items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
                size: i.size,
              })),
            }),
          });

          const result = await verifyRes.json();
          if (result.ok) {
            clearCart();
            router.push("/success");
          } else {
            alert(result.error || "Payment verification failed");
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#0a0a0a",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      alert("Something went wrong");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6">
        <p className="text-sm text-gray-500">Your cart is empty</p>
        <Link
          href="/"
          className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold tracking-wide hover:opacity-70 transition-opacity"
        >
          Continue Shopping
          <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-10 text-3xl font-extrabold tracking-tight">Cart</h1>

      <div className="divide-y divide-gray-100">
        {items.map((item: CartItem) => (
          <div
            key={`${item.productId}-${item.size}`}
            className="flex items-center gap-6 py-6"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-neutral-100">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                  No img
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted">Size: {item.size}</p>
              <p className="text-xs text-muted">Qty: {item.quantity}</p>
            </div>
            <div className="text-right space-y-2">
              <p className="text-sm font-medium">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
              <button
                onClick={() => removeItem(item.productId, item.size)}
                className="text-xs text-muted hover:text-foreground transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-gray-100 pt-8">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Total</p>
          <p className="text-sm font-semibold">
            ₹{totalPrice().toLocaleString("en-IN")}
          </p>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-8 w-full bg-foreground py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? "REDIRECTING..." : "CHECKOUT"}
        </button>

        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

        <button
          onClick={clearCart}
          className="mt-3 w-full py-3 text-xs text-gray-400 hover:text-foreground transition-colors"
        >
          Clear cart
        </button>
      </div>
    </div>
  );
}
