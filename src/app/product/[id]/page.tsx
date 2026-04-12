import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "./add-to-cart-button";
import { WishlistButton } from "@/components/wishlist-button";
import { Reveal } from "@/components/reveal";

export const revalidate = 15;

async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Product;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const soldOut = product.remaining_quantity === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-16">
      <div className="grid grid-cols-1 gap-8 sm:gap-16 md:grid-cols-2">
        {/* Product Image */}
        <Reveal variant="left">
          <div className="relative aspect-[3/4] overflow-hidden bg-white img-hover-zoom rounded-lg shadow-lg">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted">
              No image
            </div>
          )}
          </div>
        </Reveal>

        {/* Product Details */}
        <Reveal variant="right" delay={0.15}>
          <div className="flex flex-col justify-center space-y-6 sm:space-y-10">
          <div className="space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
              {product.type === "exclusive" ? "1/1 Collection" : "Core Collection"}
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
              {product.name}
            </h1>
            <p className="text-xl text-gray-500">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Stock Indicator */}
          <div>
            {soldOut ? (
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Sold Out
              </span>
            ) : product.type === "exclusive" ? (
              <p className="text-sm font-medium text-red-500">
                Only one exists
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                {product.remaining_quantity} left in stock
              </p>
            )}
          </div>

          {/* Wishlist + Add to cart */}
          <div className="flex items-center gap-4">
            <AddToCartButton product={product} />
            <WishlistButton
              productId={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.image_url}
              className="scale-150"
            />
          </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
