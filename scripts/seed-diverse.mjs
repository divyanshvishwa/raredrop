import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf8");
const envVars = {};
envContent.split(/\r?\n/).forEach((line) => {
  const match = line.trim().match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

const newProducts = [
  // ━━━ MEN (4 products across different categories) ━━━
  {
    name: "Shadow Black Graphic Tee",
    price: 1599,
    type: "core",
    total_quantity: 10,
    remaining_quantity: 6,
    image_url: "/products/men-tshirt-01.png",
    images: ["/products/men-tshirt-01.png"],
    drop_id: "drop-001",
    sizes: ["S", "M", "L", "XL"],
    category: "Oversized Tees",
    gender: "Male",
  },
  {
    name: "Olive Cargo Joggers",
    price: 2299,
    type: "core",
    total_quantity: 8,
    remaining_quantity: 4,
    image_url: "/products/men-pants-01.png",
    images: ["/products/men-pants-01.png"],
    drop_id: "drop-001",
    sizes: ["S", "M", "L", "XL"],
    category: "Pants",
    gender: "Male",
  },
  {
    name: "Navy Bomber Jacket",
    price: 3499,
    type: "core",
    total_quantity: 6,
    remaining_quantity: 3,
    image_url: "/products/men-jacket-01.png",
    images: ["/products/men-jacket-01.png"],
    drop_id: "drop-001",
    sizes: ["M", "L", "XL"],
    category: "Jackets",
    gender: "Male",
  },
  {
    name: "Stealth Snapback Cap",
    price: 899,
    type: "core",
    total_quantity: 12,
    remaining_quantity: 7,
    image_url: "/products/men-cap-01.png",
    images: ["/products/men-cap-01.png"],
    drop_id: "drop-001",
    sizes: ["M", "L"],
    category: "Caps",
    gender: "Male",
  },

  // ━━━ WOMEN (4 products across different categories) ━━━
  {
    name: "Ivory Cropped Tee",
    price: 1299,
    type: "core",
    total_quantity: 10,
    remaining_quantity: 5,
    image_url: "/products/women-tshirt-01.png",
    images: ["/products/women-tshirt-01.png"],
    drop_id: "drop-001",
    sizes: ["S", "M", "L"],
    category: "T-Shirts",
    gender: "Female",
  },
  {
    name: "Lavender Cloud Hoodie",
    price: 2499,
    type: "core",
    total_quantity: 8,
    remaining_quantity: 4,
    image_url: "/products/women-hoodie-01.png",
    images: ["/products/women-hoodie-01.png"],
    drop_id: "drop-001",
    sizes: ["S", "M", "L"],
    category: "Hoodies",
    gender: "Female",
  },
  {
    name: "Noir Wide-Leg Pants",
    price: 2199,
    type: "core",
    total_quantity: 8,
    remaining_quantity: 3,
    image_url: "/products/women-pants-01.png",
    images: ["/products/women-pants-01.png"],
    drop_id: "drop-001",
    sizes: ["S", "M", "L"],
    category: "Pants",
    gender: "Female",
  },
  {
    name: "Cream Cropped Puffer",
    price: 3999,
    type: "exclusive",
    total_quantity: 1,
    remaining_quantity: 1,
    image_url: "/products/women-jacket-01.png",
    images: ["/products/women-jacket-01.png"],
    drop_id: "drop-001",
    sizes: ["M"],
    category: "Jackets",
    gender: "Female",
  },

  // ━━━ KIDS (4 products across different categories) ━━━
  {
    name: "Rainbow Stripe Tee",
    price: 799,
    type: "core",
    total_quantity: 15,
    remaining_quantity: 9,
    image_url: "/products/kids-tshirt-01.png",
    images: ["/products/kids-tshirt-01.png"],
    drop_id: "drop-001",
    sizes: ["S", "M", "L"],
    category: "T-Shirts",
    gender: "Kids",
  },
  {
    name: "Cherry Red Mini Hoodie",
    price: 1299,
    type: "core",
    total_quantity: 10,
    remaining_quantity: 6,
    image_url: "/products/kids-hoodie-01.png",
    images: ["/products/kids-hoodie-01.png"],
    drop_id: "drop-001",
    sizes: ["S", "M", "L"],
    category: "Hoodies",
    gender: "Kids",
  },
  {
    name: "Navy Junior Joggers",
    price: 999,
    type: "core",
    total_quantity: 12,
    remaining_quantity: 8,
    image_url: "/products/kids-pants-01.png",
    images: ["/products/kids-pants-01.png"],
    drop_id: "drop-001",
    sizes: ["S", "M", "L"],
    category: "Pants",
    gender: "Kids",
  },
  {
    name: "Sunshine Bucket Hat",
    price: 599,
    type: "core",
    total_quantity: 10,
    remaining_quantity: 7,
    image_url: "/products/kids-cap-01.png",
    images: ["/products/kids-cap-01.png"],
    drop_id: "drop-001",
    sizes: ["S", "M"],
    category: "Caps",
    gender: "Kids",
  },

  // ━━━ UNISEX (4 products across different categories) ━━━
  {
    name: "Pastel Tie-Dye Oversized Tee",
    price: 1799,
    type: "core",
    total_quantity: 10,
    remaining_quantity: 5,
    image_url: "/products/unisex-tshirt-01.png",
    images: ["/products/unisex-tshirt-01.png"],
    drop_id: "drop-001",
    sizes: ["S", "M", "L", "XL"],
    category: "Oversized Tees",
    gender: "Unisex",
  },
  {
    name: "Charcoal Heavyweight Hoodie",
    price: 2699,
    type: "core",
    total_quantity: 8,
    remaining_quantity: 4,
    image_url: "/products/unisex-hoodie-01.png",
    images: ["/products/unisex-hoodie-01.png"],
    drop_id: "drop-001",
    sizes: ["S", "M", "L", "XL"],
    category: "Hoodies",
    gender: "Unisex",
  },
  {
    name: "Forest Crewneck Sweatshirt",
    price: 2199,
    type: "core",
    total_quantity: 8,
    remaining_quantity: 3,
    image_url: "/products/unisex-sweatshirt-01.png",
    images: ["/products/unisex-sweatshirt-01.png"],
    drop_id: "drop-001",
    sizes: ["S", "M", "L", "XL"],
    category: "Sweatshirts",
    gender: "Unisex",
  },
  {
    name: "Sand Dad Cap",
    price: 799,
    type: "core",
    total_quantity: 12,
    remaining_quantity: 8,
    image_url: "/products/unisex-cap-01.png",
    images: ["/products/unisex-cap-01.png"],
    drop_id: "drop-001",
    sizes: ["M", "L"],
    category: "Caps",
    gender: "Unisex",
  },
];

async function seed() {
  console.log(`Seeding ${newProducts.length} diverse products...\n`);

  const { data, error } = await supabase
    .from("products")
    .insert(newProducts)
    .select();

  if (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }

  console.log(`Successfully inserted ${data.length} products:\n`);

  // Group by gender for display
  const grouped = {};
  data.forEach((p) => {
    const g = p.gender || "Other";
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(p);
  });

  for (const [gender, products] of Object.entries(grouped)) {
    console.log(`\n━━━ ${gender} ━━━`);
    products.forEach((p) => {
      console.log(`  ✓ ${p.name} — ₹${p.price} — ${p.category} — ${p.type}`);
    });
  }

  console.log("\nDone!");
}

seed();
