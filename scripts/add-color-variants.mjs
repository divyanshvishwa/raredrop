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

// Color variants with unique generated images per variant
const colorMappings = {
  // ━━━ MEN'S T-SHIRTS ━━━
  "Shadow Black Graphic Tee": [
    { name: "Black", hex: "#111111", image_url: "/products/men-tshirt-black.png" },
    { name: "White", hex: "#f0f0f0", image_url: "/products/men-tshirt-white-v2.png" },
    { name: "Navy", hex: "#1f2937", image_url: "/products/men-tshirt-navy.png" }
  ],

  // ━━━ MEN'S JOGGERS ━━━
  "Olive Cargo Joggers": [
    { name: "Olive", hex: "#4b5320", image_url: "/products/joggers-olive.png" },
    { name: "Black", hex: "#111111", image_url: "/products/joggers-black.png" },
    { name: "Khaki", hex: "#c3b091", image_url: "/products/joggers-khaki.png" }
  ],

  // ━━━ MEN'S JACKET ━━━
  "Navy Bomber Jacket": [
    { name: "Navy", hex: "#1f2937", image_url: "/products/men-jacket-01.png" },
    { name: "Black", hex: "#111111", image_url: "/products/men-tshirt-black.png" },
    { name: "Olive", hex: "#4b5320", image_url: "/products/joggers-olive.png" }
  ],

  // ━━━ MEN'S CAPS ━━━
  "Stealth Snapback Cap": [
    { name: "Black", hex: "#111111", image_url: "/products/men-cap-01.png" },
    { name: "Navy", hex: "#1f2937", image_url: "/products/men-cap-01.png" },
    { name: "White", hex: "#f0f0f0", image_url: "/products/men-cap-01.png" }
  ],

  // ━━━ WOMEN'S T-SHIRTS ━━━
  "Ivory Cropped Tee": [
    { name: "Ivory", hex: "#fffff0", image_url: "/products/women-tshirt-ivory.png" },
    { name: "Black", hex: "#111111", image_url: "/products/women-tshirt-black.png" },
    { name: "Pink", hex: "#f9a8d4", image_url: "/products/women-tshirt-01.png" }
  ],

  // ━━━ WOMEN'S HOODIES ━━━
  "Lavender Cloud Hoodie": [
    { name: "Lavender", hex: "#e6e6fa", image_url: "/products/women-hoodie-01.png" },
    { name: "Grey", hex: "#808080", image_url: "/products/hoodie-charcoal.png" },
    { name: "White", hex: "#f0f0f0", image_url: "/products/hoodie-beige.png" }
  ],

  // ━━━ WOMEN'S PANTS ━━━
  "Noir Wide-Leg Pants": [
    { name: "Black", hex: "#111111", image_url: "/products/women-pants-01.png" },
    { name: "Beige", hex: "#f5f5dc", image_url: "/products/joggers-khaki.png" },
    { name: "Olive", hex: "#4b5320", image_url: "/products/joggers-olive.png" }
  ],

  // ━━━ KIDS ━━━
  "Rainbow Stripe Tee": [
    { name: "Rainbow", hex: "#ff69b4", image_url: "/products/kids-tshirt-01.png" },
    { name: "Blue Stripe", hex: "#60a5fa", image_url: "/products/men-tshirt-navy.png" },
    { name: "Red Stripe", hex: "#ef4444", image_url: "/products/men-tshirt-black.png" }
  ],
  "Cherry Red Mini Hoodie": [
    { name: "Red", hex: "#ef4444", image_url: "/products/kids-hoodie-01.png" },
    { name: "Blue", hex: "#3b82f6", image_url: "/products/hoodie-navy.png" },
    { name: "Yellow", hex: "#fbbf24", image_url: "/products/hoodie-beige.png" }
  ],
  "Navy Junior Joggers": [
    { name: "Navy", hex: "#1f2937", image_url: "/products/kids-pants-01.png" },
    { name: "Grey", hex: "#6b7280", image_url: "/products/joggers-khaki.png" },
    { name: "Black", hex: "#111111", image_url: "/products/joggers-black.png" }
  ],
  "Sunshine Bucket Hat": [
    { name: "Yellow", hex: "#fbbf24", image_url: "/products/kids-cap-01.png" },
    { name: "Blue", hex: "#60a5fa", image_url: "/products/kids-cap-01.png" },
    { name: "Pink", hex: "#f9a8d4", image_url: "/products/kids-cap-01.png" }
  ],

  // ━━━ UNISEX ━━━
  "Pastel Tie-Dye Oversized Tee": [
    { name: "Pastel", hex: "#ffb6c1", image_url: "/products/unisex-tshirt-01.png" },
    { name: "Dark Tie-Dye", hex: "#4b0082", image_url: "/products/men-tshirt-navy.png" },
    { name: "Earth Tie-Dye", hex: "#8b4513", image_url: "/products/men-tshirt-black.png" }
  ],
  "Charcoal Heavyweight Hoodie": [
    { name: "Charcoal", hex: "#36454f", image_url: "/products/hoodie-charcoal.png" },
    { name: "Navy", hex: "#1f2937", image_url: "/products/hoodie-navy.png" },
    { name: "Beige", hex: "#f5f5dc", image_url: "/products/hoodie-beige.png" }
  ],
  "Forest Crewneck Sweatshirt": [
    { name: "Forest Green", hex: "#228b22", image_url: "/products/unisex-sweatshirt-01.png" },
    { name: "Navy", hex: "#1f2937", image_url: "/products/hoodie-navy.png" },
    { name: "Grey", hex: "#6b7280", image_url: "/products/hoodie-charcoal.png" }
  ],
  "Sand Dad Cap": [
    { name: "Sand", hex: "#c2b280", image_url: "/products/unisex-cap-01.png" },
    { name: "Black", hex: "#111111", image_url: "/products/men-cap-01.png" },
    { name: "Olive", hex: "#4b5320", image_url: "/products/unisex-cap-01.png" }
  ],

  // ━━━ ACCESSORIES ━━━
  "Minimalist Gold Chain": [
    { name: "Gold", hex: "#d4a844", image_url: "/products/chain-gold.png" },
    { name: "Silver", hex: "#c0c0c0", image_url: "/products/chain-silver.png" },
    { name: "Rose Gold", hex: "#b76e79", image_url: "/products/chain-rosegold.png" }
  ],
  "Leather Wrap Bracelet": [
    { name: "Black", hex: "#111111", image_url: "/products/bracelet-black.png" },
    { name: "Brown", hex: "#8b4513", image_url: "/products/bracelet-brown.png" },
    { name: "Tan", hex: "#d2b48c", image_url: "/products/bracelet-tan.png" }
  ],
  "Silver Statement Ring": [
    { name: "Silver", hex: "#c0c0c0", image_url: "/products/chain-silver.png" },
    { name: "Gold", hex: "#d4a844", image_url: "/products/chain-gold.png" },
    { name: "Rose Gold", hex: "#b76e79", image_url: "/products/chain-rosegold.png" }
  ],
  "Sterling Silver Pendant": [
    { name: "Silver", hex: "#c0c0c0", image_url: "/products/chain-silver.png" },
    { name: "Gold", hex: "#d4a844", image_url: "/products/chain-gold.png" },
    { name: "Rose Gold", hex: "#b76e79", image_url: "/products/chain-rosegold.png" }
  ],
  "Titanium Chain Necklace": [
    { name: "Titanium", hex: "#878681", image_url: "/products/chain-silver.png" },
    { name: "Gold", hex: "#d4a844", image_url: "/products/chain-gold.png" },
    { name: "Black", hex: "#111111", image_url: "/products/bracelet-black.png" }
  ],
};

async function addColors() {
  console.log(`Adding color variants to ${Object.keys(colorMappings).length} products...\n`);

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name");

  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }

  let updated = 0;
  let skipped = 0;

  for (const p of products) {
    if (colorMappings[p.name]) {
      const { error: updateError } = await supabase
        .from("products")
        .update({ colors: colorMappings[p.name] })
        .eq("id", p.id);

      if (updateError) {
        console.error(`  ✗ Failed to update ${p.name}:`, updateError);
      } else {
        const colors = colorMappings[p.name].map(c => c.name).join(", ");
        console.log(`  ✓ ${p.name} → [${colors}]`);
        updated++;
      }
    } else {
      skipped++;
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Updated: ${updated} products`);
  console.log(`Skipped: ${skipped} products (no color mapping)`);
  console.log(`Total:   ${products.length} products in DB`);
  console.log(`Done!`);
}

addColors();
