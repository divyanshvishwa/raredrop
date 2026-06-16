import { GenderShopPage } from "@/components/gender-shop-page";

export const revalidate = 30;

export const metadata = {
  title: "Women — RAREDROP",
  description: "Limited-edition streetwear for women. Never restocked, never repeated.",
};

export default function WomenPage() {
  return (
    <GenderShopPage
      gender="Female"
      subtitle="Collection — Women"
      title="Women"
      tagline="Limited-edition pieces for her. Each design produced in strict quantities — once sold, gone forever."
    />
  );
}
