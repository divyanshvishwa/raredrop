"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/lib/wishlist-store";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
            Saved Items
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Wishlist
          </h1>
          <p className="text-sm text-muted">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="mt-16 rounded-lg border border-border bg-card p-16 text-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="mx-auto text-muted mb-4"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <p className="text-sm text-muted">Your wishlist is empty.</p>
            <Link
              href="/"
              className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.15em] hover:opacity-70 transition-opacity"
            >
              Browse Products &rarr;
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div key={item.productId} className="group">
                <Link href={`/product/${item.productId}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-card shadow-lg">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-muted">
                        No image
                      </div>
                    )}
                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeItem(item.productId);
                      }}
                      className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                      aria-label="Remove from wishlist"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </Link>
                <div className="mt-3 space-y-1">
                  <h3 className="text-sm font-semibold truncate">{item.name}</h3>
                  <p className="text-sm text-muted">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
