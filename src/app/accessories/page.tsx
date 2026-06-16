import { GenderShopPage } from "@/components/gender-shop-page";

export const revalidate = 30;

export const metadata = {
  title: "Accessories — RAREDROP",
  description: "Limited-edition jewelry and fashion accessories. Never restocked, never repeated.",
};

export default function AccessoriesPage() {
  return (
    <GenderShopPage
      category="Accessories"
      subtitle="Collection — Accessories"
      title="Accessories"
      tagline="Limited-edition jewelry and accessories. Each piece produced in strict quantities — once sold, gone forever."
    />
  );
}
