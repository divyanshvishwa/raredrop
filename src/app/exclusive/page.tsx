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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 sm:pt-28 pb-10 sm:pb-16">
        <Reveal className="space-y-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted">
            One of One
          </p>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Exclusive
            <br />
            Collection
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Each piece exists only once. No restocks, no duplicates.
            Once sold, it belongs to one person forever.
          </p>
        </Reveal>
      </section>

      {/* Product Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-32">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm text-muted">No exclusive pieces available right now.</p>
            <Link
              href="/"
              className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] hover:opacity-70 transition-opacity"
            >
              Back to Home &rarr;
            </Link>
          </div>
        ) : (
          <StaggerReveal variant="scale" className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ExclusiveCard key={product.id} product={product} />
            ))}
          </StaggerReveal>
        )}
      </section>
    </div>
  );
}
