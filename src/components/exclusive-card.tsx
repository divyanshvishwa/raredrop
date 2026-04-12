"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { WishlistButton } from "@/components/wishlist-button";

export function ExclusiveCard({ product }: { product: Product }) {
  const soldOut = product.remaining_quantity === 0;
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const sizes = product.sizes ?? ["S", "M", "L", "XL"];

  const handleAdd = () => {
    if (!selectedSize || soldOut) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      imageUrl: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={`group ${soldOut ? "opacity-50 pointer-events-none" : ""}`}>
      {/* Image */}
      <Link href={`/product/${product.id}`} className="card-3d block">
        <div className="card-3d-inner relative aspect-[3/4] overflow-hidden rounded-lg bg-card shadow-lg">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                soldOut ? "grayscale" : ""
              }`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted">
              No image
            </div>
          )}
          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
              <span className="bg-foreground text-white px-5 py-2 text-[10px] font-bold uppercase tracking-[0.25em]">
                Sold Out
              </span>
            </div>
          )}
          {/* Wishlist heart */}
          {!soldOut && (
            <div className="absolute top-3 right-3 z-10">
              <WishlistButton
                productId={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.image_url}
              />
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="mt-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wide">
              {product.name}
            </h3>
            <p className="text-lg font-extrabold">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>
          <span
            className={`mt-1 shrink-0 text-[9px] font-bold uppercase tracking-[0.2em] ${
              soldOut ? "text-red-400" : "text-green-700"
            }`}
          >
            {soldOut ? "Sold Out" : "Only 1 Available"}
          </span>
        </div>

        {/* Owned By */}
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
          Owned by: {soldOut ? "—" : "Unclaimed"}
        </p>

        {/* Size Selector + Add to Cart */}
        {!soldOut && (
          <div className="space-y-3 pt-1">
            <div className="flex gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`flex h-9 w-9 items-center justify-center border text-[11px] font-medium transition-colors ${
                    selectedSize === size
                      ? "border-foreground bg-foreground text-white"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              onClick={handleAdd}
              disabled={!selectedSize}
              className={`w-full py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                !selectedSize
                  ? "cursor-not-allowed bg-surface text-muted"
                  : added
                  ? "bg-green-600 text-white"
                  : "bg-foreground text-white hover:bg-neutral-800"
              }`}
            >
              {!selectedSize
                ? "Select Size"
                : added
                ? "Added ✓"
                : "Add to Cart"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
