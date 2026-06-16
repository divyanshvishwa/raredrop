import { supabase } from "@/lib/supabase";
import { Reveal } from "@/components/reveal";
import { FilteredProductGrid } from "@/components/filtered-product-grid";
import type { Product } from "@/lib/types";
import Link from "next/link";

interface GenderShopPageProps {
  gender?: "Male" | "Female" | "Unisex" | "Kids";
  category?: string;
  title: string;
  subtitle: string;
  tagline: string;
  children?: React.ReactNode;
}

async function getProductsByGender(gender: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("gender", gender)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products by gender:", error.message, error);
    return [];
  }
  return (data as Product[]) ?? [];
}

async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products by category:", error.message, error);
    return [];
  }
  return (data as Product[]) ?? [];
}

export async function GenderShopPage({
  gender,
  category,
  title,
  subtitle,
  tagline,
  children,
}: GenderShopPageProps) {
  const products = gender
    ? await getProductsByGender(gender)
    : category
      ? await getProductsByCategory(category)
      : [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 pt-10 sm:pt-16 pb-6 sm:pb-10">
          <Reveal className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted">
              {subtitle}
            </p>
            <h1 className="text-3xl font-extrabold uppercase tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              {tagline}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Product Grid */}
      <section className="pb-10 sm:pb-20">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-6 sm:py-10">
          {children ? (
            children
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <p className="text-sm text-muted">
                No products in this collection yet.
              </p>
              <Link
                href="/"
                className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-foreground hover:opacity-70 transition-opacity"
              >
                Back to Home &rarr;
              </Link>
            </div>
          ) : (
            <FilteredProductGrid
              products={products}
              variant="core"
              hideGender
            />
          )}
        </div>
      </section>
    </div>
  );
}
