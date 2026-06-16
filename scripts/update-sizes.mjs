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

/**
 * Realistic size charts per category.
 * Each category gets industry-appropriate sizing.
 */
const SIZES_BY_CATEGORY = {
  "T-Shirts":       ["S", "M", "L", "XL", "2XL"],
  "Oversized Tees": ["M", "L", "XL", "2XL"],
  "Hoodies":        ["S", "M", "L", "XL", "2XL"],
  "Sweatshirts":    ["S", "M", "L", "XL", "2XL"],
  "Jackets":        ["M", "L", "XL", "2XL"],
  "Pants":          ["28", "30", "32", "34", "36"],
  "Caps":           ["Free Size"],
  "Accessories":    ["Free Size"],
};

// Kids get different sizing
const KIDS_SIZES_BY_CATEGORY = {
  "T-Shirts":       ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
  "Oversized Tees": ["6-7Y", "8-9Y", "10-11Y", "12-13Y"],
  "Hoodies":        ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
  "Sweatshirts":    ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
  "Jackets":        ["6-7Y", "8-9Y", "10-11Y", "12-13Y"],
  "Pants":          ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
  "Caps":           ["Free Size"],
  "Accessories":    ["Free Size"],
};

async function updateSizes() {
  // Fetch all products
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, category, gender, sizes");

  if (error) {
    console.error("Error fetching products:", error.message);
    process.exit(1);
  }

  console.log(`Updating sizes for ${products.length} products...\n`);

  let updated = 0;
  for (const product of products) {
    const cat = product.category || "T-Shirts"; // default fallback
    const isKids = product.gender === "Kids";
    
    const sizeMap = isKids ? KIDS_SIZES_BY_CATEGORY : SIZES_BY_CATEGORY;
    const newSizes = sizeMap[cat] || ["S", "M", "L", "XL"];

    const { error: updateError } = await supabase
      .from("products")
      .update({ sizes: newSizes })
      .eq("id", product.id);

    if (updateError) {
      console.error(`  ✗ ${product.name}: ${updateError.message}`);
    } else {
      console.log(`  ✓ ${product.name} (${cat}, ${product.gender}) → [${newSizes.join(", ")}]`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated}/${products.length} products. Done!`);
}

updateSizes();
