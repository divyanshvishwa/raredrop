"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { ProductGallery } from "@/components/product-gallery";
import { AddToCartButton } from "./add-to-cart-button";
import { WishlistButton } from "@/components/wishlist-button";
import type { Product, AccessoryProduct, ProductColor } from "@/lib/types";

export function ProductInteractive({ product }: { product: Product | AccessoryProduct }) {
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );

  const remainingQty = product.remaining_quantity ?? 100;
  const totalQty = product.total_quantity ?? 100;
  const soldOut = remainingQty === 0;
  const isExclusive = product.type === "exclusive";
  const soldCount = totalQty - remainingQty;
  const soldPercent = totalQty > 0 ? (soldCount / totalQty) * 100 : 0;

  const numericPrice =
    typeof product.price === "number"
      ? product.price
      : Number(String(product.price).replace(/[^0-9.]/g, "")) || 0;

  const displayPrice =
    typeof product.price === "number"
      ? `₹${product.price.toLocaleString("en-IN")}`
      : String(product.price).startsWith("₹")
      ? product.price
      : `₹${product.price}`;

  // Determine main image based on color selection
  const rawMainImage = selectedColor?.image_url || product.image_url || (product as AccessoryProduct).imageUrl || "";
  
  // Combine all valid images for the gallery
  const galleryImages = [
    rawMainImage,
    ...(product.images ?? []),
    ...(selectedColor ? [selectedColor.image_url] : []),
  ].filter((url): url is string => typeof url === "string" && url.trim().length > 0);

  const mainImage = galleryImages[0] || "";


  const normalizedProduct: Product = {
    id: product.id,
    name: product.name,
    price: numericPrice,
    type: product.type ?? "core",
    total_quantity: totalQty,
    remaining_quantity: remainingQty,
    image_url: mainImage,
    images: galleryImages,
    drop_id: product.drop_id ?? "accessories",
    sizes: product.sizes ?? ["one-size"],
    category: product.category ?? "accessories",
    gender: product.gender ?? "unisex",
    created_at: product.created_at ?? new Date().toISOString(),
    colors: product.colors,
    description: product.description,
  };

  return (
    <div className="grid grid-cols-1 gap-8 sm:gap-16 md:grid-cols-2">
      {/* Product Image Gallery */}
      <Reveal variant="left">
        <ProductGallery
          mainImage={mainImage}
          images={galleryImages}
          name={product.name}
          isExclusive={isExclusive}
        />
      </Reveal>

      {/* Product Details */}
      <Reveal variant="right" delay={0.15}>
        <div className="flex flex-col justify-center space-y-6 sm:space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                {isExclusive ? "1/1 Collection" : "Core Collection"}
              </p>
              <span className="text-[10px] text-muted">·</span>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                {product.name}
              </p>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
              {product.name}
            </h1>
            <p className="text-xl text-gray-500">
              {displayPrice}
            </p>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Color</p>
                <span className="text-[10px] uppercase tracking-[0.1em]">{selectedColor?.name}</span>
              </div>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`h-8 w-8 rounded-full border-2 transition-all duration-200 hover:scale-110 active:scale-95 ${
                      selectedColor?.name === color.name
                        ? "border-foreground shadow-md scale-110"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`Select ${color.name}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Scarcity Block */}
          <div className="space-y-3">
            {soldOut ? (
              <div className="space-y-2">
                <span className="inline-block bg-gray-100 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                  Sold Out
                </span>
                <p className="text-xs text-gray-400">
                  This piece is no longer available and will never be restocked.
                </p>
              </div>
            ) : isExclusive ? (
              <div className="space-y-2 border-l-2 border-red-500 pl-4">
                <p className="text-sm font-bold text-red-500">
                  Only 1 piece exists
                </p>
                <p className="text-xs text-gray-500">
                  Once sold, gone forever. This is a true one-of-one collectible
                  that will never be reproduced.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <p className={`text-sm font-bold ${remainingQty <= 2 ? "text-red-500" : "text-foreground"}`}>
                    Only {remainingQty} left out of {totalQty}
                  </p>
                </div>
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        soldPercent >= 70 ? "bg-red-500" : soldPercent >= 40 ? "bg-amber-500" : "bg-foreground/30"
                      }`}
                      style={{ width: `${soldPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted">
                    {soldCount}/{totalQty} sold
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  Will never be restocked. Once they&apos;re gone, they&apos;re gone.
                </p>
              </div>
            )}
          </div>

          {/* Wishlist + Add to cart */}
          <div className="flex items-center gap-4">
            <AddToCartButton product={normalizedProduct} selectedColor={selectedColor} />
            <WishlistButton
              productId={product.id}
              name={product.name}
              price={numericPrice}
              imageUrl={mainImage}
              className="scale-150"
            />
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { label: "Limited Edition", desc: "Strictly limited run" },
              { label: "Never Restocked", desc: "Once sold, gone forever" },
              { label: "Collectible", desc: "Own a rare piece" },
              { label: isExclusive ? "One of One" : "Drop 001", desc: isExclusive ? "Only 1 exists" : "First ever drop" },
            ].map((item) => (
              <div key={item.label} className="space-y-0.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em]">{item.label}</p>
                <p className="text-[10px] text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
