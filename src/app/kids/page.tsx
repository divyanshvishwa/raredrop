import { GenderShopPage } from "@/components/gender-shop-page";

export const revalidate = 30;

export const metadata = {
  title: "Kids — RAREDROP",
  description: "Limited-edition streetwear for kids. Never restocked, never repeated.",
};

export default function KidsPage() {
  return (
    <GenderShopPage
      gender="Kids"
      subtitle="Collection — Kids"
      title="Kids"
      tagline="Limited-edition pieces for the little ones. Each design produced in strict quantities — once sold, gone forever."
    />
  );
}
