"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/lib/store";

export default function SuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <div className="space-y-6">
        <div className="text-4xl">✓</div>
        <h1 className="text-3xl font-extrabold tracking-tight">Order Confirmed</h1>
        <p className="text-sm text-gray-500">
          Thank you for your purchase. You&apos;ll receive a confirmation email
          shortly.
        </p>
        <p className="text-xs text-gray-400">
          Your piece is now reserved. No one else will ever own this exact item.
        </p>
        <Link
          href="/"
          className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold tracking-wide hover:opacity-70 transition-opacity"
        >
          Back to Shop
          <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
