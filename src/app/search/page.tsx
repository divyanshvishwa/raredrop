import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import type { Product } from "@/lib/types";

export const revalidate = 0;

async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .ilike("name", `%${query}%`)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Search error:", error);
    return [];
  }
  return (data as Product[]) ?? [];
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q ?? "";
  const results = query ? await searchProducts(query) : [];

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10">
      <div className="mb-12 space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
          Search
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        {query && (
          <p className="text-sm text-muted">
            {results.length} {results.length === 1 ? "product" : "products"} found
          </p>
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : query ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <p className="text-sm text-muted">No products match your search.</p>
          <Link
            href="/"
            className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold tracking-wide hover:opacity-70 transition-opacity"
          >
            Back to Shop
            <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
