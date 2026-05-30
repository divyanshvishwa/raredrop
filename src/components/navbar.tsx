"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { useState, useRef, useEffect } from "react";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Listen to auth state
  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  return (
    <header className="nav-enter sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <nav className="mx-auto flex h-14 sm:h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
        {/* Left: Menu icon + Links */}
        <div className="flex items-center gap-8">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <>
                  <path d="M3 7h18M3 12h18M3 17h18" />
                </>
              )}
            </svg>
          </button>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/#collection" className="hover:text-foreground transition-colors">
              Drop
            </Link>
            <Link href="/#collection" className="hover:text-foreground transition-colors">
              Core Collection
            </Link>
            <Link href="/#about" className="hover:text-foreground transition-colors">
              About
            </Link>
          </div>
        </div>

        {/* Center: Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <span className="text-xl font-extrabold tracking-tight transition-transform duration-300 hover:scale-105 inline-block">RAREDROP</span>
        </Link>

        {/* Right: Icons */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Exclusive */}
          <Link
            href="/exclusive"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-100"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
            </svg>
            Exclusive
          </Link>

          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-muted hover:text-foreground transition-colors"
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>

          {/* Wishlist */}
          <Link href="/wishlist" className="relative text-muted hover:text-foreground transition-colors" aria-label="Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative text-muted hover:text-foreground transition-colors" aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Profile / Account */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                if (user) {
                  setProfileOpen(!profileOpen);
                } else {
                  router.push("/login");
                }
              }}
              className="text-muted hover:text-foreground transition-colors"
              aria-label="My Account"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && user && (
              <div className="absolute right-0 mt-2 w-52 rounded-lg border border-border bg-card shadow-lg py-1.5 z-50">
                <div className="px-4 py-2.5 border-b border-border">
                  <p className="text-xs font-semibold truncate">{user.user_metadata?.full_name || user.email}</p>
                  <p className="text-[10px] text-muted truncate">{user.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="9" rx="1" />
                    <rect x="14" y="3" width="7" height="5" rx="1" />
                    <rect x="14" y="12" width="7" height="9" rx="1" />
                    <rect x="3" y="16" width="7" height="5" rx="1" />
                  </svg>
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Edit Profile
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                  Wishlist
                </Link>
                <div className="border-t border-border mt-1.5 pt-1.5">
                  <button
                    onClick={async () => {
                      setProfileOpen(false);
                      await supabaseBrowser.auth.signOut();
                      router.push("/");
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-red-500 hover:bg-surface transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      {searchOpen && (
        <div className="search-enter border-t border-border bg-background px-6 py-3">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-2xl items-center gap-3">
            <div className="relative flex-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-foreground"
              />
            </div>
            <button
              type="button"
              onClick={() => { setSearchOpen(false); setQuery(""); }}
              className="text-xs font-medium text-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu-enter md:hidden border-t border-border bg-background px-6 py-4 space-y-3">
          <Link href="/" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted hover:text-foreground">
            Home
          </Link>
          <Link href="/#collection" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted hover:text-foreground">
            Drop
          </Link>
          <Link href="/#collection" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted hover:text-foreground">
            Core Collection
          </Link>
          <Link href="/exclusive" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted hover:text-foreground">
            Exclusive 1/1
          </Link>
          <Link href="/#about" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted hover:text-foreground">
            About
          </Link>
          <div className="border-t border-border pt-3 mt-3 space-y-3">
            {user ? (
              <>
                <div className="text-xs text-muted truncate">{user.email}</div>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted hover:text-foreground">
                  Dashboard
                </Link>
                <Link href="/dashboard/profile" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted hover:text-foreground">
                  Edit Profile
                </Link>
                <button
                  onClick={async () => {
                    setMobileOpen(false);
                    await supabaseBrowser.auth.signOut();
                    router.push("/");
                  }}
                  className="block text-sm font-medium text-red-500 hover:text-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted hover:text-foreground">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
