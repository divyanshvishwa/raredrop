import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";

interface RelatedProductsProps {
  currentProductId: string;
  category: string | null;
  gender: string | null;
  type: string;
}

async function getRelatedProducts(
  currentId: string,
  category: string | null,
  gender: string | null,
  type: string
): Promise<Product[]> {
  // Try category match first
  if (category) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .neq("id", currentId)
      .limit(8);
    if (data && data.length >= 4) return data as Product[];
  }

  // Try gender match
  if (gender) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("gender", gender)
      .neq("id", currentId)
      .limit(8);
    if (data && data.length >= 4) return data as Product[];
  }

  // Try type match
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("type", type)
    .neq("id", currentId)
    .limit(8);

  if (data && data.length > 0) return data as Product[];

  // Fallback: any products
  const { data: fallback } = await supabase
    .from("products")
    .select("*")
    .neq("id", currentId)
    .limit(8);

  return (fallback as Product[]) ?? [];
}

export async function RelatedProducts({
  currentProductId,
  category,
  gender,
  type,
}: RelatedProductsProps) {
  const products = await getRelatedProducts(
    currentProductId,
    category,
    gender,
    type
  );

  if (products.length === 0) return null;

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-8 sm:mb-10 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted">
            You Might Also Like
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Related Products
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:grid-cols-4">
          {products.slice(0, 4).map((product) => {
            const soldOut = product.remaining_quantity === 0;
            const isExclusive = product.type === "exclusive";
            const soldCount =
              product.total_quantity - product.remaining_quantity;
            const soldPercent =
              product.total_quantity > 0
                ? (soldCount / product.total_quantity) * 100
                : 0;

            return (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                className="card-3d group block transition-transform duration-300"
              >
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
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] rounded ${
                          isExclusive
                            ? "bg-white text-black"
                            : "bg-black/70 text-white"
                        }`}
                      >
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
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold truncate">
                      {product.name}
                    </h3>
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
                        <p
                          className={`text-[10px] font-bold uppercase tracking-[0.1em] ${
                            product.remaining_quantity <= 2
                              ? "text-red-500"
                              : "text-muted"
                          }`}
                        >
                          {isExclusive
                            ? "Only 1 exists"
                            : `${product.remaining_quantity} left`}
                        </p>
                      )}
                    </div>

                    {/* Scarcity bar */}
                    {!soldOut && !isExclusive && (
                      <div className="space-y-1">
                        <div className="h-1 w-full rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              soldPercent >= 70
                                ? "bg-red-500"
                                : soldPercent >= 40
                                  ? "bg-amber-500"
                                  : "bg-foreground/30"
                            }`}
                            style={{ width: `${soldPercent}%` }}
                          />
                        </div>
                        <p className="text-[9px] uppercase tracking-[0.15em] text-muted">
                          {soldCount}/{product.total_quantity} sold
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
