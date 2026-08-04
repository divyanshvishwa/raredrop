"use client";
import { useState } from "react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [searched, setSearched] = useState(false);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight mb-4">Track Order</h1>
      <p className="text-muted-foreground mb-8">Enter your Order ID and Email address to view live tracking details.</p>
      
      <form onSubmit={(e) => { e.preventDefault(); setSearched(true); }} className="space-y-4 border border-border p-6 rounded-lg bg-card shadow-sm">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Order ID</label>
          <input
            type="text"
            required
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. order_TLcelb4eAah1Ox"
            className="w-full rounded border border-border bg-background p-3 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@example.com"
            className="w-full rounded border border-border bg-background p-3 text-sm outline-none focus:border-foreground"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-foreground py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors"
        >
          Track Order
        </button>
      </form>

      {searched && (
        <div className="mt-8 border border-border p-6 rounded-lg bg-card">
          <p className="text-sm font-semibold">Status: Processing</p>
          <p className="text-xs text-muted mt-1">Your order is being prepared for dispatch.</p>
        </div>
      )}
    </div>
  );
}
