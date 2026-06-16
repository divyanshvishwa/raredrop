export const CATEGORIES = [
  "T-Shirts",
  "Hoodies",
  "Sweatshirts",
  "Jackets",
  "Pants",
  "Caps",
  "Oversized Tees",
  "Accessories",
] as const;

export const GENDERS = ["Male", "Female", "Unisex", "Kids"] as const;

export const SIZES = ["S", "M", "L", "XL"] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Gender = (typeof GENDERS)[number];
export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
