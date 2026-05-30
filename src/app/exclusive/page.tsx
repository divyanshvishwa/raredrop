import { supabase } from "@/lib/supabase";
import { ExclusiveCard } from "@/components/exclusive-card";
import { Reveal, StaggerReveal } from "@/components/reveal";
import type { Product } from "@/lib/types";
import Link from "next/link";

export const revalidate = 15;

export const metadata = {
  title: "Exclusive Collection — RAREDROP",
  description: "1/1 pieces. Only one exists. Once sold, gone forever.",
};

async function getExclusiveProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("type", "exclusive")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching exclusive products:", error);
    return [];
  }
  return (data as Product[]) ?? [];
}

export default async function ExclusivePage() {
  const products = await getExclusiveProducts();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 pt-10 sm:pt-16 pb-6 sm:pb-10">
          <Reveal className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/50">
              One of One — Only 1 Piece Exists
            </p>
            <h1 className="text-3xl font-extrabold uppercase tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Exclusive
              <br />
              Collection
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-white/50">
              Each piece exists only once. No restocks, no duplicates.
              Once sold, it belongs to one person forever. Own a true collectible.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                  Live Drop
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Product Grid */}
      <section className="bg-[#0a0a0a] text-white pb-10 sm:pb-20">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <p className="text-sm text-white/50">No exclusive pieces available right now.</p>
            <Link
              href="/"
              className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-white hover:opacity-70 transition-opacity"
            >
              Back to Home &rarr;
            </Link>
          </div>
        ) : (
          <StaggerReveal variant="scale" className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ExclusiveCard key={product.id} product={product} />
            ))}
          </StaggerReveal>
        )}
        </div>
      </section>
    </div>
  );
}
