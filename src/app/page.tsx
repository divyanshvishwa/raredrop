import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/product-card";
import { Reveal, StaggerReveal } from "@/components/reveal";
import type { Product } from "@/lib/types";

export const revalidate = 30;

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("drop_id", "drop-001")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return (data as Product[]) ?? [];
}

export default async function HomePage() {
  const products = await getProducts();

  const coreProducts = products.filter((p) => p.type === "core");
  const exclusiveProducts = products.filter((p) => p.type === "exclusive");

  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[60vh] lg:min-h-[85vh]">

            {/* Hero Content */}
            <div className="flex flex-col justify-center py-12 lg:py-24">
              <div className="space-y-6 lg:space-y-8">
                <div className="space-y-3">
                  <p className="hero-fade-in text-[11px] font-medium uppercase tracking-[0.3em] text-muted">
                    Summer 2024
                  </p>
                  <h1 className="text-4xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] sm:text-5xl md:text-7xl lg:text-8xl">
                    <div className="hero-text-line"><span>New</span></div>
                    <div className="hero-text-line"><span>Collection</span></div>
                  </h1>
                </div>
                <p className="hero-fade-in-delay-1 max-w-sm text-sm leading-relaxed text-muted">
                  Every piece is unique. Limited quantities, no restocks.
                  Once sold, gone forever.
                </p>
                <Link
                  href="#collection"
                  className="hero-fade-in-delay-2 btn-lift group inline-flex items-center gap-2 text-sm font-semibold tracking-wide hover:opacity-70 transition-opacity"
                >
                  Go To Shop
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Hero Images */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5 py-6 lg:py-24">
              {coreProducts.slice(0, 2).map((product, i) => (
                <Link href={`/product/${product.id}`} key={product.id} className={`card-3d group ${i === 0 ? 'hero-image-enter' : 'hero-image-enter-delay'}`}>
                  <div className="card-3d-inner relative aspect-[3/4] overflow-hidden rounded-lg bg-card shadow-lg img-hover-zoom">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-muted">
                        No image
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Collection */}
      <section id="collection" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-24">
        <Reveal className="mb-8 sm:mb-16 space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
            Drop 001
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Core Collection
          </h2>
          <p className="text-sm text-muted">
            5–10 units per design
          </p>
        </Reveal>
        <StaggerReveal variant="scale" className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:grid-cols-4">
          {coreProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </StaggerReveal>
      </section>

      {/* 1/1 Collection */}
      {exclusiveProducts.length > 0 && (
        <section id="new" className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-24">
            <Reveal className="mb-8 sm:mb-16 space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                One of One
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                1/1 Collection
              </h2>
              <p className="text-sm text-muted">
                Only one exists
              </p>
            </Reveal>
            <StaggerReveal variant="scale" className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3">
              {exclusiveProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </StaggerReveal>
          </div>
        </section>
      )}

      {/* About / Brand */}
      <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-24">
          <div className="grid grid-cols-1 gap-10 sm:gap-16 md:grid-cols-2 md:items-center">
            <Reveal variant="left" className="space-y-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                About the Drop
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                No Restocks.
                <br />
                No Repeats.
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-muted">
                Each design exists in small quantities. Some exist only once.
                A curated collection of limited pieces for those who value rarity.
              </p>
              <Link
                href="#collection"
                className="btn-lift group inline-flex items-center gap-2 text-sm font-semibold tracking-wide hover:opacity-70 transition-opacity"
              >
                View Products
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </Link>
            </Reveal>
            <Reveal variant="right">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-card shadow-lg img-hover-zoom">
                <Image
                  src="/products/hero.avif"
                  alt="RAREDROP Collection"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="flex flex-col items-center gap-6 text-center">
            <p className="text-lg font-extrabold tracking-tight">RAREDROP</p>
            <div className="flex gap-8 text-xs font-medium uppercase tracking-[0.2em] text-muted">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link href="/#collection" className="hover:text-foreground transition-colors">Collections</Link>
              <Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link>
            </div>
            <p className="text-xs text-accent">
              &copy; {new Date().getFullYear()} RAREDROP. All rights reserved.
            </p>
          </Reveal>
        </div>
      </footer>
    </div>
  );
}
