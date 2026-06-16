import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";

/**
 * Style-pairing engine: maps each category to complementary categories.
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

// Labels for same-category recommendations (accessory-to-accessory etc.)
const SAME_CAT_LABELS = [
  "Stack with this",
  "Layer this piece",
  "Pairs well with",
  "Also goes with",
];

interface CompleteTheLookProps {
  currentProductId: string;
  category: string | null;
  gender: string | null;
}

/**
 * Deterministic hash from product ID so different products show
 * different recommendations, but same product always shows same set.
 */
function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

async function getStylePairings(
  currentId: string,
  category: string | null,
  gender: string | null
): Promise<{ label: string; product: Product }[]> {
  // Fetch ALL in-stock products except the current one
  const { data: allData } = await supabase
    .from("products")
    .select("*")
    .neq("id", currentId)
    .gt("remaining_quantity", 0);

  if (!allData || allData.length === 0) return [];

  const allProducts = allData as Product[];
  const seed = hashId(currentId);
  const results: { label: string; product: Product }[] = [];
  const usedIds = new Set<string>();

  /**
   * Pick the best product from a pool, preferring same gender then Unisex.
   * Uses seed + offset for variety across different source products.
   */
  function pickFromPool(pool: Product[], offset: number): Product {
    const sameGender = pool.filter(p => p.gender === gender);
    const unisex = pool.filter(p => p.gender === "Unisex");
    const candidates = sameGender.length > 0 ? sameGender : unisex.length > 0 ? unisex : pool;
    return candidates[(seed + offset * 17) % candidates.length];
  }

  // Step 1: Try complementary categories first
  const complementary = category ? (STYLE_PAIRINGS[category] || []) : [];
  
  for (let i = 0; i < complementary.length && results.length < 4; i++) {
    const pairCat = complementary[i];
    const pool = allProducts.filter(
      p => p.category === pairCat && !usedIds.has(p.id)
    );
    if (pool.length === 0) continue;

    const pick = pickFromPool(pool, i);
    usedIds.add(pick.id);
    results.push({
      label: PAIRING_LABELS[pairCat] || pairCat,
      product: pick,
    });
  }

  // Step 2: If we still need more, recommend same-category items
  // (e.g. "stack this ring with this bracelet")
  if (results.length < 4 && category) {
    const sameCatPool = allProducts.filter(
      p => p.category === category && !usedIds.has(p.id)
    );

    // Shuffle deterministically
    const sorted = [...sameCatPool].sort((a, b) => {
      const ha = hashId(a.id + currentId);
      const hb = hashId(b.id + currentId);
      return ha - hb;
    });

    let labelIdx = 0;
    for (const product of sorted) {
      if (results.length >= 4) break;
      usedIds.add(product.id);
      results.push({
        label: SAME_CAT_LABELS[labelIdx % SAME_CAT_LABELS.length],
        product,
      });
      labelIdx++;
    }
  }

  // Step 3: Final fallback — grab any remaining products
  if (results.length < 4) {
    const remaining = allProducts
      .filter(p => !usedIds.has(p.id))
      .sort((a, b) => {
        const ha = hashId(a.id + currentId);
        const hb = hashId(b.id + currentId);
        return ha - hb;
      });

    for (const product of remaining) {
      if (results.length >= 4) break;
      const cat = product.category || "item";
      usedIds.add(product.id);
      results.push({
        label: PAIRING_LABELS[cat] || `Add ${cat.toLowerCase()}`,
        product,
      });
    }
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
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
                    product.total_quantity) * 100
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
