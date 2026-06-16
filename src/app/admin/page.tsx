"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/use-auth";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { useEffect, useState, useRef } from "react";
import type { Product, Order } from "@/lib/types";
import { CATEGORIES, GENDERS } from "@/lib/constants";

interface OrderWithProduct extends Order {
  products?: { name: string; image_url: string | null; price: number } | null;
}

export default function AdminDashboardPage() {
  const { user, loading, signOut } = useAuth("/admin/login");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderWithProduct[]>([]);
  const [tab, setTab] = useState<"overview" | "products" | "orders">("overview");
  const [loadingData, setLoadingData] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", remaining_quantity: "", total_quantity: "", image_url: "", images: [] as string[], category: "", gender: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditForm({
      name: p.name,
      price: String(p.price),
      remaining_quantity: String(p.remaining_quantity),
      total_quantity: String(p.total_quantity),
      image_url: p.image_url ?? "",
      images: p.images ?? [],
      category: p.category ?? "",
      gender: p.gender ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name: editForm.name,
        price: Number(editForm.price),
        remaining_quantity: Number(editForm.remaining_quantity),
        total_quantity: Number(editForm.total_quantity),
        image_url: editForm.image_url || null,
        images: editForm.images,
        category: editForm.category || null,
        gender: editForm.gender || null,
      }),
    });
    const json = await res.json();
    if (res.ok && json.product) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? (json.product as Product) : p))
      );
      setEditingId(null);
    }
    setSaving(false);
  };

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [prodRes, ordRes] = await Promise.all([
        supabaseBrowser
          .from("products")
          .select("*")
          .order("created_at", { ascending: true }),
        supabaseBrowser
          .from("orders")
          .select("*, products(name, image_url, price)")
          .order("created_at", { ascending: false }),
      ]);
      setProducts((prodRes.data as Product[]) ?? []);
      setOrders((ordRes.data as OrderWithProduct[]) ?? []);
      setLoadingData(false);
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const paidOrders = orders.filter((o) => o.payment_status === "paid");
  const totalRevenue = paidOrders.reduce(
    (sum, o) => sum + (o.products?.price ?? 0) * o.quantity,
    0
  );
  const totalSold = paidOrders.reduce((sum, o) => sum + o.quantity, 0);
  const outOfStock = products.filter((p) => p.remaining_quantity === 0).length;

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "products" as const, label: "Products" },
    { key: "orders" as const, label: "Orders" },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
                Admin
              </p>
              <span className="rounded-full bg-foreground/5 border border-border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-muted">
                Protected
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Admin Panel
            </h1>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
          <div className="flex gap-3 self-start">
            <Link
              href="/"
              className="rounded-lg border border-border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted transition-colors hover:border-foreground hover:text-foreground"
            >
              View Store
            </Link>
            <button
              onClick={signOut}
              className="rounded-lg bg-foreground px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-neutral-800"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex gap-1 border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${
                tab === t.key
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loadingData ? (
          <div className="mt-16 flex justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
          </div>
        ) : (
          <div className="mt-8">
            {/* OVERVIEW TAB */}
            {tab === "overview" && (
              <div className="space-y-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
                  <div className="rounded-lg border border-border bg-card p-6 space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                      Total Products
                    </p>
                    <p className="text-3xl font-extrabold">{products.length}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-6 space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                      Orders
                    </p>
                    <p className="text-3xl font-extrabold">{paidOrders.length}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-6 space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                      Revenue
                    </p>
                    <p className="text-3xl font-extrabold">
                      ₹{totalRevenue.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-6 space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                      Out of Stock
                    </p>
                    <p className="text-3xl font-extrabold">{outOfStock}</p>
                  </div>
                </div>

                {/* Inventory Summary */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide mb-4">
                    Inventory Status
                  </h3>
                  <div className="space-y-2">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-surface">
                            {p.image_url ? (
                              <Image
                                src={p.image_url}
                                alt={p.name}
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full" />
                            )}
                          </div>
                          <p className="text-sm font-semibold">{p.name}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-[0.15em] ${
                              p.remaining_quantity === 0
                                ? "text-red-500"
                                : "text-green-700"
                            }`}
                          >
                            {p.remaining_quantity === 0
                              ? "Sold Out"
                              : `${p.remaining_quantity}/${p.total_quantity}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders */}
                {paidOrders.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide mb-4">
                      Recent Orders
                    </h3>
                    <div className="space-y-2">
                      {paidOrders.slice(0, 5).map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-3"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {order.products?.name ?? "Product"}
                            </p>
                            <p className="text-[10px] text-muted">{order.email}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold">
                              ₹
                              {(
                                (order.products?.price ?? 0) * order.quantity
                              ).toLocaleString("en-IN")}
                            </p>
                            <p className="text-[10px] text-muted">
                              {new Date(order.created_at).toLocaleDateString(
                                "en-IN",
                                { day: "numeric", month: "short" }
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PRODUCTS TAB */}
            {tab === "products" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted">
                    {products.length} products · {totalSold} sold
                  </p>
                </div>
                <div className="space-y-3">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-lg border border-border bg-card p-5"
                    >
                      {editingId === p.id ? (
                        /* ---- EDIT MODE ---- */
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface">
                              {(editForm.image_url || p.image_url) ? (
                                <Image
                                  src={editForm.image_url || p.image_url!}
                                  alt={editForm.name || p.name}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">—</div>
                              )}
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                              Editing
                            </p>
                          </div>

                          {/* Image Upload */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Main Image</label>
                            <div className="flex gap-3">
                              <input
                                type="url"
                                value={editForm.image_url}
                                onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                                placeholder="Paste image URL or upload a file →"
                                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                              />
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setUploading(true);
                                  const form = new FormData();
                                  form.append("file", file);
                                  try {
                                    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
                                    const json = await res.json();
                                    if (res.ok && json.url) {
                                      setEditForm((prev) => ({ ...prev, image_url: json.url }));
                                    } else {
                                      alert(json.error || "Upload failed");
                                    }
                                  } catch {
                                    alert("Upload failed — check your connection");
                                  }
                                  setUploading(false);
                                  if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="shrink-0 rounded-md border border-border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-muted transition-colors hover:border-foreground hover:text-foreground disabled:opacity-50"
                              >
                                {uploading ? "Uploading..." : "Upload"}
                              </button>
                            </div>
                          </div>

                          {/* Additional Images */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
                              Gallery Images ({editForm.images.length})
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {editForm.images.map((url, idx) => (
                                <div key={idx} className="group relative h-16 w-16 rounded-md overflow-hidden bg-surface border border-border">
                                  <Image src={url} alt={`Gallery ${idx + 1}`} fill sizes="64px" className="object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setEditForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                    className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                              <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-border text-muted hover:border-foreground hover:text-foreground transition-colors">
                                <span className="text-lg">+</span>
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp,image/gif"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setUploading(true);
                                    const form = new FormData();
                                    form.append("file", file);
                                    try {
                                      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
                                      const json = await res.json();
                                      if (res.ok && json.url) {
                                        setEditForm((prev) => ({ ...prev, images: [...prev.images, json.url] }));
                                      } else {
                                        alert(json.error || "Upload failed");
                                      }
                                    } catch {
                                      alert("Upload failed");
                                    }
                                    setUploading(false);
                                    e.target.value = "";
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Name</label>
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Price (₹)</label>
                              <input
                                type="number"
                                value={editForm.price}
                                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Stock</label>
                              <input
                                type="number"
                                min="0"
                                value={editForm.remaining_quantity}
                                onChange={(e) => setEditForm({ ...editForm, remaining_quantity: e.target.value })}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Total Qty</label>
                              <input
                                type="number"
                                min="1"
                                value={editForm.total_quantity}
                                onChange={(e) => setEditForm({ ...editForm, total_quantity: e.target.value })}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Category</label>
                              <select
                                value={editForm.category}
                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                              >
                                <option value="">— None —</option>
                                {CATEGORIES.map((c) => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Gender</label>
                              <select
                                value={editForm.gender}
                                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                              >
                                <option value="">— None —</option>
                                {GENDERS.map((g) => (
                                  <option key={g} value={g}>{g}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => saveEdit(p.id)}
                              disabled={saving}
                              className="rounded-md bg-foreground px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
                            >
                              {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="rounded-md border border-border px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-muted transition-colors hover:border-foreground hover:text-foreground"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* ---- VIEW MODE ---- */
                        <div className="flex items-center gap-5">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface">
                            {p.image_url ? (
                              <Image
                                src={p.image_url}
                                alt={p.name}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">—</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{p.name}</p>
                            <p className="text-xs text-muted">
                              {p.type === "exclusive" ? "Exclusive · 1/1" : `Core · ${p.total_quantity} units`}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold">
                              ₹{p.price.toLocaleString("en-IN")}
                            </p>
                            <p
                              className={`text-[10px] font-bold uppercase tracking-[0.15em] ${
                                p.remaining_quantity === 0
                                  ? "text-red-500"
                                  : "text-green-700"
                              }`}
                            >
                              {p.remaining_quantity === 0
                                ? "Sold Out"
                                : `${p.remaining_quantity} left`}
                            </p>
                          </div>
                          <button
                            onClick={() => startEdit(p)}
                            className="shrink-0 rounded-md border border-border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-muted transition-colors hover:border-foreground hover:text-foreground"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {tab === "orders" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted">
                    {paidOrders.length} paid orders · ₹
                    {totalRevenue.toLocaleString("en-IN")} revenue
                  </p>
                </div>
                {paidOrders.length === 0 ? (
                  <div className="rounded-lg border border-border bg-card p-12 text-center">
                    <p className="text-sm text-muted">No orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paidOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center gap-5 rounded-lg border border-border bg-card p-5"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-surface">
                          {order.products?.image_url ? (
                            <Image
                              src={order.products.image_url}
                              alt={order.products.name ?? ""}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">
                              —
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">
                            {order.products?.name ?? "Product"}
                          </p>
                          <p className="text-xs text-muted truncate">
                            {order.email}
                            {order.size ? ` · Size ${order.size}` : ""}
                            {` · Qty ${order.quantity}`}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold">
                            ₹
                            {(
                              (order.products?.price ?? 0) * order.quantity
                            ).toLocaleString("en-IN")}
                          </p>
                          <p className="text-[10px] text-muted">
                            {new Date(order.created_at).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-green-700">
                          Paid
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
