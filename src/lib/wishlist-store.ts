"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  addedAt: number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, "addedAt">) => void;
  removeItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toggleItem: (item: Omit<WishlistItem, "addedAt">) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          if (state.items.some((i) => i.productId === item.productId)) return state;
          return { items: [...state.items, { ...item, addedAt: Date.now() }] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      isWishlisted: (productId) =>
        get().items.some((i) => i.productId === productId),

      toggleItem: (item) => {
        const { items } = get();
        if (items.some((i) => i.productId === item.productId)) {
          set({ items: items.filter((i) => i.productId !== item.productId) });
        } else {
          set({ items: [...items, { ...item, addedAt: Date.now() }] });
        }
      },

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "raredrop-wishlist" }
  )
);
