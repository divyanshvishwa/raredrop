"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { ExclusiveCard } from "@/components/exclusive-card";
import { StaggerReveal } from "@/components/reveal";
import {
  CATEGORIES,
  GENDERS,
  SIZES,
  SORT_OPTIONS,
  type SortOption,
} from "@/lib/constants";

interface FilteredProductGridProps {
  products: Product[];
  variant?: "core" | "exclusive";
  hideGender?: boolean;
}

export function FilteredProductGrid({
  products,
  variant = "core",
  hideGender = false,
}: FilteredProductGridProps) {
  const [category, setCategory] = useState<string[]>([]);
  const [gender, setGender] = useState<string[]>([]);
  const [size, setSize] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("newest");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [open, setOpen] = useState(false);

  const toggle = (arr: string[], setArr: (v: string[]) => void, value: string) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  // Pre-compute price bounds for placeholder
  const { minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { minPrice: 0, maxPrice: 0 };
    const prices = products.map((p) => p.price);
    return { minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (category.length > 0)
      list = list.filter((p) => p.category && category.includes(p.category));
    if (gender.length > 0)
      list = list.filter((p) => p.gender && gender.includes(p.gender));
    if (size.length > 0)
      list = list.filter((p) => p.sizes?.some((s) => size.includes(s)));
    if (inStockOnly) list = list.filter((p) => p.remaining_quantity > 0);

    const minN = priceMin === "" ? null : Number(priceMin);
    const maxN = priceMax === "" ? null : Number(priceMax);
    if (minN !== null && !Number.isNaN(minN))
      list = list.filter((p) => p.price >= minN);
    if (maxN !== null && !Number.isNaN(maxN))
      list = list.filter((p) => p.price <= maxN);

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        list.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return list;
  }, [products, category, gender, size, inStockOnly, priceMin, priceMax, sort]);

  const activeCount =
    category.length +
    gender.length +
    size.length +
    (inStockOnly ? 1 : 0) +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0);

  const reset = () => {
    setCategory([]);
    setGender([]);
    setSize([]);
    setInStockOnly(false);
    setPriceMin("");
    setPriceMax("");
    setSort("newest");
  };

  const isDark = variant === "exclusive";
  const pillBase =
    "px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full border transition-colors cursor-pointer";
  const pillInactive = isDark
    ? "border-white/20 text-white/60 hover:border-white/60 hover:text-white"
    : "border-border text-muted hover:border-foreground hover:text-foreground";
  const pillActive = isDark
    ? "border-white bg-white text-black"
    : "border-foreground bg-foreground text-white";
  const labelCls = isDark
    ? "text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50"
    : "text-[10px] font-semibold uppercase tracking-[0.2em] text-muted";
  const inputCls = isDark
    ? "w-full sm:w-24 rounded-md border border-white/20 bg-transparent px-3 py-1.5 text-xs text-white outline-none focus:border-white"
    : "w-full sm:w-24 rounded-md border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-foreground";
  const selectCls = isDark
    ? "rounded-md border border-white/20 bg-transparent px-3 py-1.5 text-xs text-white outline-none focus:border-white [&>option]:text-black"
    : "rounded-md border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-foreground";

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div
        className={`rounded-lg border ${
          isDark ? "border-white/10 bg-white/5" : "border-border bg-card"
        }`}
      >
        {/* Header */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex w-full items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 ${
            isDark ? "text-white" : "text-foreground"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
              Filters
            </span>
            {activeCount > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isDark ? "bg-white text-black" : "bg-foreground text-white"
                }`}
              >
                {activeCount}
              </span>
            )}
            <span
              className={`text-[11px] ${
                isDark ? "text-white/50" : "text-muted"
              }`}
            >
              {filtered.length} of {products.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  reset();
                }}
                className={`text-[10px] font-semibold uppercase tracking-[0.15em] underline ${
                  isDark ? "text-white/70 hover:text-white" : "text-muted hover:text-foreground"
                }`}
              >
                Clear
              </span>
            )}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </button>

        {/* Body */}
        {open && (
          <div
            className={`space-y-5 border-t px-4 py-4 sm:px-5 sm:py-5 ${
              isDark ? "border-white/10" : "border-border"
            }`}
          >
            {/* Category */}
            <div className="space-y-2">
              <p className={labelCls}>Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const active = category.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggle(category, setCategory, c)}
                      className={`${pillBase} ${active ? pillActive : pillInactive}`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gender */}
            {!hideGender && (
              <div className="space-y-2">
                <p className={labelCls}>Gender</p>
                <div className="flex flex-wrap gap-2">
                  {GENDERS.map((g) => {
                    const active = gender.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggle(gender, setGender, g)}
                        className={`${pillBase} ${active ? pillActive : pillInactive}`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size */}
            <div className="space-y-2">
              <p className={labelCls}>Size</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => {
                  const active = size.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggle(size, setSize, s)}
                      className={`${pillBase} min-w-[40px] text-center ${
                        active ? pillActive : pillInactive
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row: Price + Sort + In Stock */}
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
              <div className="space-y-2">
                <p className={labelCls}>
                  Price (₹{minPrice.toLocaleString("en-IN")} – ₹
                  {maxPrice.toLocaleString("en-IN")})
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    placeholder="Min"
                    className={inputCls}
                  />
                  <span className={isDark ? "text-white/40" : "text-muted"}>
                    —
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    placeholder="Max"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className={labelCls}>Sort</p>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className={selectCls}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-current"
                />
                <span
                  className={`text-[11px] font-semibold uppercase tracking-[0.15em] ${
                    isDark ? "text-white/80" : "text-foreground"
                  }`}
                >
                  In stock only
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          className={`rounded-lg border ${
            isDark ? "border-white/10 bg-white/5 text-white/60" : "border-border bg-card text-muted"
          } p-10 text-center text-sm`}
        >
          No products match your filters.
          <button
            type="button"
            onClick={reset}
            className={`ml-2 underline ${
              isDark ? "text-white" : "text-foreground"
            }`}
          >
            Reset
          </button>
        </div>
      ) : isDark ? (
        <StaggerReveal
          variant="scale"
          className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((product) => (
            <ExclusiveCard key={product.id} product={product} />
          ))}
        </StaggerReveal>
      ) : (
        <StaggerReveal
          variant="scale"
          className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:grid-cols-4"
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </StaggerReveal>
      )}
    </div>
  );
}
