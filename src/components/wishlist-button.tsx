"use client";

import { useWishlistStore } from "@/lib/wishlist-store";
import { useState } from "react";

interface WishlistButtonProps {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  className?: string;
}

export function WishlistButton({ productId, name, price, imageUrl, className = "" }: WishlistButtonProps) {
  const { isWishlisted, toggleItem } = useWishlistStore();
  const wishlisted = isWishlisted(productId);
  const [animating, setAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    toggleItem({ productId, name, price, imageUrl });
    setTimeout(() => setAnimating(false), 400);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`transition-all duration-200 hover:scale-125 active:scale-95 ${className}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={wishlisted ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        className={`transition-all duration-300 ${animating ? "scale-130" : ""} ${
          wishlisted ? "text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.4)]" : "text-gray-500 hover:text-gray-700 drop-shadow-md"
        }`}
        style={animating ? { transform: "scale(1.3)", transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)" } : { transform: "scale(1)", transition: "transform 0.3s ease" }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    </button>
  );
}
