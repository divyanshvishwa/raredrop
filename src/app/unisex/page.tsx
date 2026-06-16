import { GenderShopPage } from "@/components/gender-shop-page";

export const revalidate = 30;

export const metadata = {
  title: "Unisex — RAREDROP",
  description: "Limited-edition unisex streetwear. Never restocked, never repeated.",
};

export default function UnisexPage() {
  return (
    <GenderShopPage
      gender="Unisex"
      subtitle="Collection — Unisex"
      title="Unisex"
      tagline="Limited-edition pieces for everyone. Each design produced in strict quantities — once sold, gone forever."
    />
  );
}
