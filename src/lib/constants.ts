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

export const SIZES = ["S", "M", "L", "XL", "2XL"] as const;

// Category-specific size options
export const SIZES_BY_CATEGORY: Record<string, readonly string[]> = {
  "T-Shirts":       ["S", "M", "L", "XL", "2XL"],
  "Oversized Tees": ["M", "L", "XL", "2XL"],
  "Hoodies":        ["S", "M", "L", "XL", "2XL"],
  "Sweatshirts":    ["S", "M", "L", "XL", "2XL"],
  "Jackets":        ["M", "L", "XL", "2XL"],
  "Pants":          ["28", "30", "32", "34", "36"],
  "Caps":           ["Free Size"],
  "Accessories":    ["Free Size"],
} as const;

export const KIDS_SIZES_BY_CATEGORY: Record<string, readonly string[]> = {
  "T-Shirts":       ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
  "Oversized Tees": ["6-7Y", "8-9Y", "10-11Y", "12-13Y"],
  "Hoodies":        ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
  "Sweatshirts":    ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
  "Jackets":        ["6-7Y", "8-9Y", "10-11Y", "12-13Y"],
  "Pants":          ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
  "Caps":           ["Free Size"],
  "Accessories":    ["Free Size"],
} as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Gender = (typeof GENDERS)[number];
export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
