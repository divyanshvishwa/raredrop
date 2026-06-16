import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import { ProductInteractive } from "./product-interactive";
import { RelatedProducts } from "@/components/related-products";
import { CustomerReviews } from "@/components/customer-reviews";
import { CompleteTheLook } from "@/components/complete-the-look";

export const revalidate = 15;

async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Product;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-6 sm:py-10">
        <ProductInteractive product={product} />
      </div>

      {/* Complete the Look — Outfit Recommendations */}
      <CompleteTheLook
        currentProductId={product.id}
        category={product.category}
        gender={product.gender}
      />
      
      {/* Customer Reviews */}
      <CustomerReviews />

      {/* Related Products */}
      <RelatedProducts 
        currentProductId={product.id}
        category={product.category}
        gender={product.gender}
        type={product.type}
      />
    </div>
  );
}
