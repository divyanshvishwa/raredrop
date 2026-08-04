"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product, ProductColor } from "@/lib/types";
import { WishlistButton } from "@/components/wishlist-button";

export function ProductCard({ product, invertColors }: { product: Product; invertColors?: boolean }) {
  const [hoveredColor, setHoveredColor] = useState<ProductColor | null>(null);
  
  const soldOut = product.remaining_quantity === 0;
  const isExclusive = product.type === "exclusive";
  const soldCount = product.total_quantity - product.remaining_quantity;
  const soldPercent = product.total_quantity > 0 ? (soldCount / product.total_quantity) * 100 : 0;

  // Determine the displayed image — hover color overrides default
  const displayImage = hoveredColor ? hoveredColor.image_url : product.image_url;
  const hasColors = product.colors && product.colors.length > 0;

  return (
    <div className="group block transition-transform duration-300">
      <div className="space-y-4">
        {/* Image Container */}
        <Link href={`/product/${product.id}`} className="card-3d block">
          <div className="card-3d-inner relative aspect-[3/4] overflow-hidden rounded-lg bg-card shadow-lg img-hover-zoom">
            {displayImage ? (
              <div className="relative h-full w-full">
                {/* Base image (always rendered to prevent flash) */}
                <Image
                  src={product.image_url || ""}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={`object-cover transition-opacity duration-500 group-hover:scale-105 ${
                    soldOut ? "opacity-40 grayscale" : ""
                  } ${hoveredColor ? "opacity-0" : "opacity-100"}`}
                />
                {/* Color variant overlay — crossfade on top */}
                {hoveredColor && (
                  <Image
                    key={hoveredColor.name}
                    src={hoveredColor.image_url}
                    alt={`${product.name} — ${hoveredColor.name}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className={`object-cover transition-opacity duration-500 group-hover:scale-105 ${
                      soldOut ? "opacity-40 grayscale" : ""
                    } animate-variant-fade`}
                  />
                )}
              </div>
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
                imageUrl={displayImage}
              />
            </div>

            {/* Active color name badge — shown when hovering a color */}
            {hoveredColor && (
              <div className="absolute bottom-3 left-3 z-10 animate-variant-fade">
                <span className="rounded-full bg-black/70 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                  {hoveredColor.name}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className={`text-sm font-semibold ${invertColors ? "text-white" : ""}`}>{product.name}</h3>

          {/* Color Swatches — Live Variant Picker */}
          {hasColors && (
            <div className="flex items-center gap-1.5">
              {product.colors!.map((color) => {
                const isActive = hoveredColor?.name === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setHoveredColor(isActive ? null : color);
                    }}
                    onMouseEnter={() => setHoveredColor(color)}
                    onMouseLeave={() => setHoveredColor(null)}
                    className={`relative h-5 w-5 rounded-full border-2 transition-all duration-200 hover:scale-125 active:scale-95 ${
                      isActive
                        ? `border-foreground scale-110 shadow-md ring-1 ring-foreground/20`
                        : `border-gray-200 hover:border-gray-400`
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`View ${color.name} variant`}
                  >
                    {/* Inner highlight ring for light colors */}
                    {(color.hex === "#f0f0f0" || color.hex === "#fffff0" || color.hex === "#f5f5dc" || color.hex === "#fbbf24") && (
                      <span className="absolute inset-0.5 rounded-full border border-gray-200" />
                    )}
                  </button>
                );
              })}
              {/* Color count indicator */}
              <span className={`ml-1 text-[9px] font-medium uppercase tracking-[0.1em] ${invertColors ? "text-white/40" : "text-muted"}`}>
                {product.colors!.length} colors
              </span>
            </div>
          )}

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
    </div>
  );
}
