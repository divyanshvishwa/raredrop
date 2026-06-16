import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Read .env.local manually
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

// Only the 12 accessories that have actual downloaded images (acc-001 to acc-012)
const accessories = [
  {
    name: "Minimalist Gold Chain",
    price: 1299,
    type: "core",
    total_quantity: 8,
    remaining_quantity: 5,
    image_url: "/products/acc-001.png",
    images: ["/products/acc-001.png"],
    drop_id: "drop-001",
    sizes: ["S", "M", "L"],
    category: "Accessories",
    gender: "Unisex",
  },
  {
    name: "Silver Statement Ring",
    price: 899,
    type: "core",
    total_quantity: 12,
    remaining_quantity: 7,
    image_url: "/products/acc-002.png",
    images: ["/products/acc-002.png"],
    drop_id: "drop-001",
    sizes: ["S", "M", "L", "XL"],
    category: "Accessories",
    gender: "Unisex",
  },
  {
    name: "Geometric Earrings Set",
    price: 649,
    type: "core",
    total_quantity: 10,
    remaining_quantity: 3,
    image_url: "/products/acc-003.png",
    images: ["/products/acc-003.png"],
    drop_id: "drop-001",
    sizes: ["S", "M"],
    category: "Accessories",
    gender: "Female",
  },
  {
    name: "Leather Wrap Bracelet",
    price: 499,
    type: "core",
    total_quantity: 15,
    remaining_quantity: 9,
    image_url: "/products/acc-004.png",
    images: ["/products/acc-004.png"],
    drop_id: "drop-001",
    sizes: ["S", "M", "L"],
    category: "Accessories",
    gender: "Unisex",
  },
  {
    name: "Pearl Drop Necklace",
    price: 1099,
    type: "core",
    total_quantity: 6,
    remaining_quantity: 2,
    image_url: "/products/acc-005.png",
    images: ["/products/acc-005.png"],
    drop_id: "drop-001",
    sizes: ["S", "M"],
    category: "Accessories",
    gender: "Female",
  },
  {
    name: "Stackable Silver Bands",
    price: 749,
    type: "core",
    total_quantity: 10,
    remaining_quantity: 6,
    image_url: "/products/acc-006.png",
    images: ["/products/acc-006.png"],
    drop_id: "drop-001",
    sizes: ["S", "M", "L"],
    category: "Accessories",
    gender: "Unisex",
  },
  {
    name: "Diamond Tennis Bracelet",
    price: 1999,
    type: "exclusive",
    total_quantity: 1,
    remaining_quantity: 1,
    image_url: "/products/acc-007.png",
    images: ["/products/acc-007.png"],
    drop_id: "drop-001",
    sizes: ["M"],
    category: "Accessories",
    gender: "Unisex",
  },
  {
    name: "Gold Hoop Earrings",
    price: 849,
    type: "core",
    total_quantity: 8,
    remaining_quantity: 4,
    image_url: "/products/acc-008.png",
    images: ["/products/acc-008.png"],
    drop_id: "drop-001",
    sizes: ["S", "M"],
    category: "Accessories",
    gender: "Female",
  },
  {
    name: "Rose Gold Watch",
    price: 2499,
    type: "exclusive",
    total_quantity: 1,
    remaining_quantity: 1,
    image_url: "/products/acc-009.png",
    images: ["/products/acc-009.png"],
    drop_id: "drop-001",
    sizes: ["M"],
    category: "Accessories",
    gender: "Unisex",
  },
  {
    name: "Sterling Silver Pendant",
    price: 949,
    type: "core",
    total_quantity: 10,
    remaining_quantity: 5,
    image_url: "/products/acc-010.png",
    images: ["/products/acc-010.png"],
    drop_id: "drop-001",
    sizes: ["S", "M", "L"],
    category: "Accessories",
    gender: "Unisex",
  },
  {
    name: "Onyx Cufflinks Duo",
    price: 1149,
    type: "core",
    total_quantity: 6,
    remaining_quantity: 4,
    image_url: "/products/acc-011.png",
    images: ["/products/acc-011.png"],
    drop_id: "drop-001",
    sizes: ["S", "M"],
    category: "Accessories",
    gender: "Male",
  },
  {
    name: "Titanium Chain Necklace",
    price: 1399,
    type: "core",
    total_quantity: 8,
    remaining_quantity: 3,
    image_url: "/products/acc-012.png",
    images: ["/products/acc-012.png"],
    drop_id: "drop-001",
    sizes: ["S", "M", "L"],
    category: "Accessories",
    gender: "Male",
  },
];

async function reset() {
  // Step 1: Delete ALL existing accessory products
  console.log("Deleting all existing accessory products...");
  const { error: deleteError, count } = await supabase
    .from("products")
    .delete({ count: "exact" })
    .eq("category", "Accessories");

  if (deleteError) {
    console.error("Error deleting accessories:", deleteError.message);
    process.exit(1);
  }
  console.log(`Deleted ${count ?? "all"} existing accessory products.\n`);

  // Step 2: Re-insert only the 12 with real images
  console.log("Inserting 12 accessories with actual downloaded images...\n");
  const { data, error: insertError } = await supabase
    .from("products")
    .insert(accessories)
    .select();

  if (insertError) {
    console.error("Error inserting accessories:", insertError.message);
    process.exit(1);
  }

  console.log(`Successfully inserted ${data.length} accessories:\n`);
  data.forEach((p) => {
    console.log(`  ✓ ${p.name} — Rs.${p.price} · ${p.image_url}`);
  });
  console.log("\nDone!");
}

reset();
