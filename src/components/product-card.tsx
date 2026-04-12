"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { WishlistButton } from "@/components/wishlist-button";

export function ProductCard({ product, invertColors }: { product: Product; invertColors?: boolean }) {
  const soldOut = product.remaining_quantity === 0;
  const isExclusive = product.type === "exclusive";
  const soldCount = product.total_quantity - product.remaining_quantity;
  const soldPercent = product.total_quantity > 0 ? (soldCount / product.total_quantity) * 100 : 0;

  return (
    <Link href={`/product/${product.id}`} className="card-3d group block transition-transform duration-300">
      <div className="space-y-4">
        <div className="card-3d-inner relative aspect-[3/4] overflow-hidden rounded-lg bg-card shadow-lg img-hover-zoom">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                soldOut ? "opacity-40 grayscale" : ""
              }`}
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center text-sm text-muted ${
                soldOut ? "opacity-40" : ""
              }`}
            >
              No image
            </div>
          )}

          {/* Type Tag */}
          <div className="absolute top-3 left-3 z-10">
            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] rounded ${
              isExclusive
                ? "bg-white text-black"
                : "bg-black/70 text-white"
            }`}>
              {isExclusive ? "1/1" : "Core"}
            </span>
          </div>

          {/* Sold Out Overlay */}
          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                Sold Out
              </span>
            </div>
          )}

          {/* Wishlist heart */}
          <div className="absolute top-3 right-3 z-10">
            <WishlistButton
              productId={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.image_url}
            />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className={`text-sm font-semibold ${invertColors ? "text-white" : ""}`}>{product.name}</h3>
          <div className="flex items-center justify-between">
            <p className={`text-sm ${invertColors ? "text-white/60" : "text-muted"}`}>
              {soldOut ? (
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                  Sold Out
                </span>
              ) : (
                `₹${product.price.toLocaleString("en-IN")}`
              )}
            </p>
            {!soldOut && (
              <p className={`text-[10px] font-bold uppercase tracking-[0.1em] ${
                product.remaining_quantity <= 2 ? "text-red-500" : invertColors ? "text-white/50" : "text-muted"
              }`}>
                {isExclusive ? "Only 1 exists" : `Only ${product.remaining_quantity} left`}
              </p>
            )}
          </div>
          {/* Scarcity progress bar */}
          {!soldOut && !isExclusive && (
            <div className="space-y-1">
              <div className={`h-1 w-full rounded-full overflow-hidden ${invertColors ? "bg-white/10" : "bg-gray-200"}`}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    soldPercent >= 70 ? "bg-red-500" : soldPercent >= 40 ? "bg-amber-500" : invertColors ? "bg-white/40" : "bg-foreground/30"
                  }`}
                  style={{ width: `${soldPercent}%` }}
                />
              </div>
              <p className={`text-[9px] uppercase tracking-[0.15em] ${invertColors ? "text-white/40" : "text-muted"}`}>
                {soldCount}/{product.total_quantity} sold
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
