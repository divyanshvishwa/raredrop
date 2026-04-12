"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { WishlistButton } from "@/components/wishlist-button";

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.remaining_quantity === 0;

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
          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
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
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">{product.name}</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              {soldOut ? (
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                  Sold Out
                </span>
              ) : (
                `₹${product.price.toLocaleString("en-IN")}`
              )}
            </p>
            {!soldOut && (
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted">
                {product.remaining_quantity} left
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
