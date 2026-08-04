import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Product, AccessoryProduct } from "@/lib/types";
import { jewelryCollection } from "@/data/jewelry";
import { ProductInteractive } from "./product-interactive";
import { RelatedProducts } from "@/components/related-products";
import { CustomerReviews } from "@/components/customer-reviews";
import { CompleteTheLook } from "@/components/complete-the-look";

export const revalidate = 15;

async function getProduct(id: string): Promise<Product | AccessoryProduct | null> {
  // First, check if the product exists in the local jewelry collection
  const accessoryProduct = jewelryCollection.find(item => item.id === id);
  if (accessoryProduct) {
    return accessoryProduct;
  }

  // If not in jewelry collection, fetch from Supabase
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Product;
}

async function getAllProductIds() {
  const { data, error } = await supabase.from("products").select("id");

  if (error) {
    console.error("Error fetching product IDs for static params:", error);
    return [];
  }
  return data || [];
}

export async function generateStaticParams() {
  const supabaseProducts = await getAllProductIds();
  const jewelryProductIds = jewelryCollection.map(item => ({ id: item.id }));

  const allProductIds = [
    ...supabaseProducts.map((product) => ({ id: product.id })),
    ...jewelryProductIds,
  ];

  return allProductIds;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Ensure product.category and product.gender are defined for CompleteTheLook and RelatedProducts
  const category = product.category || "accessories"; // Default category for accessories
  const gender = product.gender || "unisex"; // Default gender for accessories
  const type = product.type || "core"; // Default type for accessories

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-6 sm:py-10">
        <ProductInteractive product={product} />
      </div>

      {/* Complete the Look — Outfit Recommendations */}
      <CompleteTheLook
        currentProductId={product.id}
        category={category}
        gender={gender}
      />
      
      {/* Customer Reviews */}
      <CustomerReviews />

      {/* Related Products */}
      <RelatedProducts 
        currentProductId={product.id}
        category={category}
        gender={gender}
        type={type}
      />
    </div>
  );
}


