"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const soldOut = product.remaining_quantity === 0;
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
    <div className="space-y-6">
      {/* Size Selector */}
      {!soldOut && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Size</p>
          <div className="flex gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex h-11 w-11 items-center justify-center border text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                  selectedSize === size
                    ? "border-foreground bg-foreground text-white shadow-md"
                    : "border-gray-200 hover:border-foreground"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to Cart */}
      <button
        onClick={handleAdd}
        disabled={soldOut || !selectedSize}
        className={`btn-lift w-full py-4 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 active:scale-[0.98] ${
          soldOut
            ? "cursor-not-allowed bg-gray-100 text-gray-400"
            : !selectedSize
            ? "cursor-not-allowed bg-gray-200 text-gray-400"
            : added
            ? "bg-green-600 text-white"
            : "bg-foreground text-white hover:bg-neutral-800"
        }`}
      >
        {soldOut
          ? "Sold Out"
          : !selectedSize
          ? "Select a Size"
          : added
          ? "Added to Cart"
          : "Add to Cart"}
      </button>
    </div>
  );
}
