import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/product-card";
import { Reveal, StaggerReveal } from "@/components/reveal";
import { CountdownTimer } from "@/components/countdown-timer";
import { FilteredProductGrid } from "@/components/filtered-product-grid";
import type { Product } from "@/lib/types";

export const revalidate = 30;

// Drop end date — update this for each new drop
const DROP_END_DATE = "2026-05-15T23:59:59";

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

  const totalSold = products.reduce(
    (acc, p) => acc + (p.total_quantity - p.remaining_quantity),
    0
  );
  const totalStock = products.reduce((acc, p) => acc + p.total_quantity, 0);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[50vh] lg:min-h-[65vh]">

            {/* Hero Content */}
            <div className="flex flex-col justify-center py-8 lg:py-12">
              <div className="space-y-4 lg:space-y-5">
                <div className="space-y-3">
                  <p className="hero-fade-in text-[11px] font-medium uppercase tracking-[0.3em] text-muted">
                    Drop 001 — Summer 2026
                  </p>
                  <h1 className="text-4xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] sm:text-5xl md:text-7xl lg:text-8xl">
                    <div className="hero-text-line"><span>Limited</span></div>
                    <div className="hero-text-line"><span>Edition.</span></div>
                  </h1>
                  <p className="hero-fade-in text-base sm:text-lg font-semibold tracking-tight text-foreground/70">
                    Never Repeated. Never Restocked.
                  </p>
                </div>
                <p className="hero-fade-in-delay-1 max-w-sm text-sm leading-relaxed text-muted">
                  Own a collectible. Every piece is produced in strictly limited quantities.
                  Once sold, gone forever. If you don&apos;t buy now, you&apos;ll miss it.
                </p>
                <div className="hero-fade-in-delay-1 flex flex-wrap items-center gap-4">
                  <Link
                    href="#collection"
                    className="btn-lift inline-flex items-center gap-2 bg-foreground text-white px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-800 transition-colors"
                  >
                    Shop Drop
                  </Link>
                  <Link
                    href="/exclusive"
                    className="btn-lift inline-flex items-center gap-2 border border-foreground px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] hover:bg-foreground hover:text-white transition-colors"
                  >
                    View 1/1
                  </Link>
                </div>
                {/* Countdown Timer */}
                <div className="hero-fade-in-delay-2">
                  <CountdownTimer targetDate={DROP_END_DATE} label="Drop closes in" />
                </div>
              </div>
            </div>

            {/* Hero Images */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5 py-4 lg:py-12">
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
                    {/* Scarcity badge on hero images */}
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
                        {product.remaining_quantity === 0
                          ? "Sold Out"
                          : `Only ${product.remaining_quantity} left`}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scarcity Banner */}
      <section className="bg-foreground text-white">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[10px] font-bold uppercase tracking-[0.25em]">
          <span>Limited Edition</span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span>Never Restocked</span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span>Never Repeated</span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span>{totalSold}/{totalStock} Sold</span>
        </div>
      </section>

      {/* Core Collection */}
      <section id="collection" className="mx-auto max-w-[1600px] px-4 sm:px-6 py-8 sm:py-14">
        <Reveal className="mb-6 sm:mb-10 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
            Drop 001 — Core
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Core Collection
          </h2>
          <p className="text-sm text-muted">
            5–10 units per design · Will never be restocked
          </p>
        </Reveal>
        <FilteredProductGrid products={coreProducts} variant="core" />
      </section>

      {/* Exclusive 1/1 Collection — premium dark section */}
      {exclusiveProducts.length > 0 && (
        <section id="exclusive" className="bg-[#0a0a0a] text-white">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-8 sm:py-14">
            <Reveal className="mb-6 sm:mb-10 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
                One of One — Exclusive
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                1/1 Collection
              </h2>
              <p className="text-sm text-white/50">
                Only one piece exists. Once sold, gone forever.
              </p>
            </Reveal>
            <StaggerReveal variant="scale" className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3">
              {exclusiveProducts.map((product) => (
                <ProductCard key={product.id} product={product} invertColors />
              ))}
            </StaggerReveal>
          </div>
        </section>
      )}

      {/* About / Brand */}
      <section id="about" className="border-t border-border">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-8 sm:py-14">
          <div className="grid grid-cols-1 gap-6 sm:gap-10 md:grid-cols-2 md:items-center">
            <Reveal variant="left" className="space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                The Philosophy
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                Own a<br />Collectible.
              </h2>
              <div className="space-y-4 max-w-md text-sm leading-relaxed text-muted">
                <p>
                  RAREDROP is not a normal clothing store. Every design is produced
                  in strictly limited quantities — some exist only once.
                </p>
                <p>
                  No restocks. No repeats. No second chances. If you see it and
                  don&apos;t buy it, someone else will — and it&apos;ll be gone forever.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="#collection"
                  className="btn-lift inline-flex items-center gap-2 bg-foreground text-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-800 transition-colors"
                >
                  Shop Drop
                </Link>
                <Link
                  href="/exclusive"
                  className="btn-lift inline-flex items-center gap-2 border border-foreground px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] hover:bg-foreground hover:text-white transition-colors"
                >
                  View 1/1
                </Link>
              </div>
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
      <footer className="border-t border-border py-6 sm:py-10">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
          <Reveal className="flex flex-col items-center gap-4 text-center">
            <p className="text-lg font-extrabold tracking-tight">RAREDROP</p>
            <p className="text-xs text-muted max-w-xs">Limited Edition. Never Restocked. Never Repeated.</p>
            <div className="flex flex-wrap justify-center gap-8 text-xs font-medium uppercase tracking-[0.2em] text-muted">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link href="/#collection" className="hover:text-foreground transition-colors">Drop</Link>
              <Link href="/#collection" className="hover:text-foreground transition-colors">Core</Link>
              <Link href="/exclusive" className="hover:text-foreground transition-colors">Exclusive 1/1</Link>
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
