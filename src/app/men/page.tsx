import { GenderShopPage } from "@/components/gender-shop-page";

export const revalidate = 30;

export const metadata = {
  title: "Men — RAREDROP",
  description: "Limited-edition streetwear for men. Never restocked, never repeated.",
};

export default function MenPage() {
  return (
    <GenderShopPage
      gender="Male"
      subtitle="Collection — Men"
      title="Men"
      tagline="Limited-edition pieces engineered for him. Each design produced in strict quantities — once sold, gone forever."
    />
  );
}
