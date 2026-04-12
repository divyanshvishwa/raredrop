"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/use-auth";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useEffect, useState } from "react";
import type { Order } from "@/lib/types";

interface OrderWithProduct extends Order {
  products?: { name: string; image_url: string | null; price: number } | null;
}

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const wishlistItems = useWishlistStore((s) => s.items);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);
  const [orders, setOrders] = useState<OrderWithProduct[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data } = await supabaseBrowser
        .from("orders")
        .select("*, products(name, image_url, price)")
        .eq("email", user.email!)
        .order("created_at", { ascending: false });
      setOrders((data as OrderWithProduct[]) ?? []);
      setLoadingOrders(false);
    };
    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const paidOrders = orders.filter((o) => o.payment_status === "paid");
  const totalSpent = paidOrders.reduce(
    (sum, o) => sum + (o.products?.price ?? 0) * o.quantity,
    0
  );

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
              My Account
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
          <button
            onClick={signOut}
            className="self-start rounded-lg border border-border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted transition-colors hover:border-foreground hover:text-foreground"
          >
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              Total Orders
            </p>
            <p className="text-3xl font-extrabold">{paidOrders.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              Total Spent
            </p>
            <p className="text-3xl font-extrabold">
              ₹{totalSpent.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              Member Since
            </p>
            <p className="text-3xl font-extrabold">
              {new Date(user.created_at).toLocaleDateString("en-IN", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Orders */}
        <div className="mt-16">
          <h2 className="text-xl font-extrabold tracking-tight">
            Order History
          </h2>

          {loadingOrders ? (
            <div className="mt-8 flex justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
            </div>
          ) : paidOrders.length === 0 ? (
            <div className="mt-8 rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-sm text-muted">No orders yet.</p>
              <Link
                href="/"
                className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.15em] hover:opacity-70 transition-opacity"
              >
                Start Shopping &rarr;
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {paidOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-5 rounded-lg border border-border bg-card p-5"
                >
                  {/* Image */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface">
                    {order.products?.image_url ? (
                      <Image
                        src={order.products.image_url}
                        alt={order.products.name ?? "Product"}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">
                        —
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">
                      {order.products?.name ?? "Product"}
                    </p>
                    <p className="text-xs text-muted">
                      {order.size && `Size: ${order.size} · `}
                      Qty: {order.quantity}
                    </p>
                  </div>

                  {/* Price & Date */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">
                      ₹{((order.products?.price ?? 0) * order.quantity).toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] text-muted">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Status */}
                  <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-green-700">
                    Paid
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wishlist */}
        <div className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold tracking-tight">
              Wishlist
            </h2>
            {wishlistItems.length > 0 && (
              <Link
                href="/wishlist"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-muted hover:text-foreground transition-colors"
              >
                View All
              </Link>
            )}
          </div>

          {wishlistItems.length === 0 ? (
            <div className="mt-6 rounded-lg border border-border bg-card p-10 text-center">
              <p className="text-sm text-muted">No saved items yet.</p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {wishlistItems.slice(0, 4).map((item) => (
                <div key={item.productId} className="group relative">
                  <Link href={`/product/${item.productId}`} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-card shadow-sm">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">—</div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFromWishlist(item.productId);
                        }}
                        className="absolute top-2 right-2 rounded-full bg-white/90 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </Link>
                  <p className="mt-2 text-xs font-semibold truncate">{item.name}</p>
                  <p className="text-xs text-muted">₹{item.price.toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-16 flex flex-wrap gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold tracking-wide hover:opacity-70 transition-opacity"
          >
            Continue Shopping
            <span className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
          <Link
            href="/exclusive"
            className="group inline-flex items-center gap-2 text-sm font-semibold tracking-wide hover:opacity-70 transition-opacity"
          >
            Exclusive Collection
            <span className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
