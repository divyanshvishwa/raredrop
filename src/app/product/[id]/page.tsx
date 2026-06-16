import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "./add-to-cart-button";
import { WishlistButton } from "@/components/wishlist-button";
import { Reveal } from "@/components/reveal";
import { ProductGallery } from "@/components/product-gallery";
import { RelatedProducts } from "@/components/related-products";
import { CustomerReviews } from "@/components/customer-reviews";

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
  const isExclusive = product.type === "exclusive";
  const soldCount = product.total_quantity - product.remaining_quantity;
  const soldPercent = product.total_quantity > 0 ? (soldCount / product.total_quantity) * 100 : 0;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 gap-8 sm:gap-16 md:grid-cols-2">
          {/* Product Image Gallery */}
          <Reveal variant="left">
            <ProductGallery
              mainImage={product.image_url}
              images={product.images ?? []}
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
                ₹{product.price.toLocaleString("en-IN")}
              </p>
            </div>

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
                    <p className={`text-sm font-bold ${product.remaining_quantity <= 2 ? "text-red-500" : "text-foreground"}`}>
                      Only {product.remaining_quantity} left out of {product.total_quantity}
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
                      {soldCount}/{product.total_quantity} sold
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
              <AddToCartButton product={product} />
              <WishlistButton
                productId={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.image_url}
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
      </div>
      
      {/* Customer Reviews */}
      <CustomerReviews />

      {/* Related Products */}
      <RelatedProducts 
        currentProductId={product.id}
        category={product.category}
        gender={product.gender}
        type={product.type}
      />
    </div>
  );
}
