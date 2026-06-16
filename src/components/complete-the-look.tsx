import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";

/**
 * Style-pairing engine: maps each category to complementary categories
 * that would "complete the look". Order matters — first items are preferred.
 */
const STYLE_PAIRINGS: Record<string, string[]> = {
  "T-Shirts":       ["Accessories", "Caps", "Pants", "Jackets", "Hoodies"],
  "Oversized Tees": ["Accessories", "Caps", "Pants", "Jackets"],
  "Hoodies":        ["Accessories", "Caps", "Pants", "T-Shirts"],
  "Sweatshirts":    ["Accessories", "Caps", "Pants", "T-Shirts"],
  "Jackets":        ["T-Shirts", "Accessories", "Caps", "Pants"],
  "Pants":          ["T-Shirts", "Hoodies", "Accessories", "Caps", "Oversized Tees"],
  "Caps":           ["T-Shirts", "Hoodies", "Accessories", "Jackets", "Oversized Tees"],
  "Accessories":    ["T-Shirts", "Hoodies", "Caps", "Oversized Tees", "Jackets", "Pants"],
};

// Friendly labels for pairing suggestions
const PAIRING_LABELS: Record<string, string> = {
  "T-Shirts":       "Pair with a tee",
  "Oversized Tees": "Layer with an oversized tee",
  "Hoodies":        "Throw on a hoodie",
  "Sweatshirts":    "Add a sweatshirt",
  "Jackets":        "Top it with a jacket",
  "Pants":          "Complete with pants",
  "Caps":           "Crown it with a cap",
  "Accessories":    "Finish with an accessory",
};

interface CompleteTheLookProps {
  currentProductId: string;
  category: string | null;
  gender: string | null;
}

/**
 * Use the product ID to create a deterministic but varied "seed" so that
 * different products show different recommendations, but the same product
 * always shows the same set (no random flicker on refresh).
 */
function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

async function getStylePairings(
  currentId: string,
  category: string | null,
  gender: string | null
): Promise<{ label: string; product: Product }[]> {
  if (!category) {
    // If no category, try to recommend accessories and other popular items
    const { data } = await supabase
      .from("products")
      .select("*")
      .neq("id", currentId)
      .gt("remaining_quantity", 0)
      .limit(20);

    if (!data || data.length === 0) return [];

    const products = data as Product[];
    const seed = hashId(currentId);
    const results: { label: string; product: Product }[] = [];
    const usedIds = new Set<string>();

    // Pick varied categories
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    
    for (let i = 0; i < Math.min(4, categories.length); i++) {
      const catIdx = (seed + i * 7) % categories.length;
      const cat = categories[catIdx]!;
      const catProducts = products.filter(p => p.category === cat && !usedIds.has(p.id));
      
      if (catProducts.length > 0) {
        // Prefer same gender
        const sameGender = catProducts.find(p => p.gender === gender);
        const unisex = catProducts.find(p => p.gender === "Unisex");
        const pickIdx = (seed + i * 13) % catProducts.length;
        const pick = sameGender || unisex || catProducts[pickIdx];
        usedIds.add(pick.id);
        results.push({
          label: PAIRING_LABELS[cat] || `Add ${cat.toLowerCase()}`,
          product: pick,
        });
      }
    }
    return results;
  }

  const complementaryCategories = STYLE_PAIRINGS[category];
  if (!complementaryCategories) return [];

  // Fetch all potential products in one query for efficiency
  const { data: allProducts } = await supabase
    .from("products")
    .select("*")
    .in("category", complementaryCategories)
    .neq("id", currentId)
    .gt("remaining_quantity", 0);

  if (!allProducts || allProducts.length === 0) return [];

  const products = allProducts as Product[];
  const seed = hashId(currentId);
  const results: { label: string; product: Product }[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < complementaryCategories.length; i++) {
    const pairCat = complementaryCategories[i];
    const catProducts = products.filter(
      (p) => p.category === pairCat && !usedIds.has(p.id)
    );

    if (catProducts.length === 0) continue;

    // Gender-aware selection with variety using deterministic seed
    const sameGender = catProducts.filter((p) => p.gender === gender);
    const unisex = catProducts.filter((p) => p.gender === "Unisex");
    
    let pool: Product[];
    if (sameGender.length > 0) {
      pool = sameGender;
    } else if (unisex.length > 0) {
      pool = unisex;
    } else {
      pool = catProducts;
    }

    // Use seed to pick different items for different products
    const pickIdx = (seed + i * 17) % pool.length;
    const pick = pool[pickIdx];
    usedIds.add(pick.id);

    results.push({
      label: PAIRING_LABELS[pairCat] || pairCat,
      product: pick,
    });

    if (results.length >= 4) break;
  }

  return results;
}

export async function CompleteTheLook({
  currentProductId,
  category,
  gender,
}: CompleteTheLookProps) {
  const pairings = await getStylePairings(currentProductId, category, gender);

  if (pairings.length === 0) return null;

  const outfitTotal = pairings.reduce((sum, p) => sum + p.product.price, 0);

  return (
    <section className="border-t border-border bg-[#fafaf8]">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-10 sm:py-16">
        {/* Header */}
        <div className="mb-8 sm:mb-12 space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted">
                Styled for You
              </p>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Complete the Look
              </h2>
            </div>
          </div>
          <p className="text-sm text-muted max-w-lg">
            Curated pieces that pair perfectly with your selection. Each item is limited
            edition — grab them before they&apos;re gone.
          </p>
        </div>

        {/* Pairing Cards */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {pairings.map(({ label, product }) => {
            const soldPercent =
              product.total_quantity > 0
                ? ((product.total_quantity - product.remaining_quantity) /
                    product.total_quantity) *
                  100
                : 0;

            return (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                className="group block"
              >
                <div className="space-y-3">
                  {/* Label pill */}
                  <span className="inline-block rounded-full bg-foreground/5 border border-border px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-muted">
                    {label}
                  </span>

                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-card shadow-md transition-shadow group-hover:shadow-xl">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-muted">
                        No image
                      </div>
                    )}

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="rounded bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-foreground shadow-sm">
                        {product.category}
                      </span>
                    </div>

                    {/* Scarcity indicator */}
                    {product.remaining_quantity <= 3 && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="rounded bg-red-500/90 backdrop-blur-sm px-2.5 py-1.5 text-center">
                          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                            Only {product.remaining_quantity} left
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold truncate group-hover:text-foreground/70 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted">
                        {product.remaining_quantity}/{product.total_quantity} left
                      </p>
                    </div>
                    {/* Mini progress bar */}
                    <div className="h-1 w-full rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          soldPercent >= 70
                            ? "bg-red-500"
                            : soldPercent >= 40
                              ? "bg-amber-500"
                              : "bg-foreground/20"
                        }`}
                        style={{ width: `${soldPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Outfit total */}
        <div className="mt-8 sm:mt-10 flex items-center justify-between rounded-lg border border-border bg-card p-5">
          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">
              Complete Outfit Price
            </p>
            <p className="text-sm text-muted">
              {pairings.length} curated {pairings.length === 1 ? "piece" : "pieces"} to pair with your selection
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold">
              ₹{outfitTotal.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-muted uppercase tracking-wider">
              All limited edition
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
