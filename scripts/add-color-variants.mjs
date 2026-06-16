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

// We define color variants to add. 
// For "Shadow Black Graphic Tee", we use the actual generated white shirt image.
// For others, we reuse their base image as a placeholder for the color variants.
const colorMappings = {
  "Shadow Black Graphic Tee": [
    { name: "Black", hex: "#111111", image_url: "/products/men-tshirt-01.png" },
    { name: "White", hex: "#f0f0f0", image_url: "/products/men-tshirt-white.png" }, // Using the one image we generated successfully
    { name: "Navy", hex: "#1f2937", image_url: "/products/men-tshirt-01.png" } // Placeholder
  ],
  "Olive Cargo Joggers": [
    { name: "Olive", hex: "#4b5320", image_url: "/products/men-pants-01.png" },
    { name: "Black", hex: "#111111", image_url: "/products/men-pants-01.png" },
    { name: "Khaki", hex: "#c3b091", image_url: "/products/men-pants-01.png" }
  ],
  "Navy Bomber Jacket": [
    { name: "Navy", hex: "#1f2937", image_url: "/products/men-jacket-01.png" },
    { name: "Black", hex: "#111111", image_url: "/products/men-jacket-01.png" },
    { name: "Olive", hex: "#4b5320", image_url: "/products/men-jacket-01.png" }
  ],
  "Stealth Snapback Cap": [
    { name: "Black", hex: "#111111", image_url: "/products/men-cap-01.png" },
    { name: "Navy", hex: "#1f2937", image_url: "/products/men-cap-01.png" },
    { name: "White", hex: "#f0f0f0", image_url: "/products/men-cap-01.png" }
  ],
  "Ivory Cropped Tee": [
    { name: "Ivory", hex: "#fffff0", image_url: "/products/women-tshirt-01.png" },
    { name: "Black", hex: "#111111", image_url: "/products/women-tshirt-01.png" },
    { name: "Pink", hex: "#ffc0cb", image_url: "/products/women-tshirt-01.png" }
  ],
  "Lavender Cloud Hoodie": [
    { name: "Lavender", hex: "#e6e6fa", image_url: "/products/women-hoodie-01.png" },
    { name: "Grey", hex: "#808080", image_url: "/products/women-hoodie-01.png" },
    { name: "White", hex: "#f0f0f0", image_url: "/products/women-hoodie-01.png" }
  ],
  "Noir Wide-Leg Pants": [
    { name: "Black", hex: "#111111", image_url: "/products/women-pants-01.png" },
    { name: "Beige", hex: "#f5f5dc", image_url: "/products/women-pants-01.png" },
    { name: "Olive", hex: "#4b5320", image_url: "/products/women-pants-01.png" }
  ],
  "Rainbow Stripe Tee": [
    { name: "Rainbow", hex: "#ff69b4", image_url: "/products/kids-tshirt-01.png" },
    { name: "Blue Stripe", hex: "#add8e6", image_url: "/products/kids-tshirt-01.png" },
    { name: "Red Stripe", hex: "#ff0000", image_url: "/products/kids-tshirt-01.png" }
  ],
  "Cherry Red Mini Hoodie": [
    { name: "Red", hex: "#ff0000", image_url: "/products/kids-hoodie-01.png" },
    { name: "Blue", hex: "#0000ff", image_url: "/products/kids-hoodie-01.png" },
    { name: "Yellow", hex: "#ffff00", image_url: "/products/kids-hoodie-01.png" }
  ],
  "Navy Junior Joggers": [
    { name: "Navy", hex: "#1f2937", image_url: "/products/kids-pants-01.png" },
    { name: "Grey", hex: "#808080", image_url: "/products/kids-pants-01.png" },
    { name: "Black", hex: "#111111", image_url: "/products/kids-pants-01.png" }
  ],
  "Sunshine Bucket Hat": [
    { name: "Yellow", hex: "#ffff00", image_url: "/products/kids-cap-01.png" },
    { name: "Blue", hex: "#add8e6", image_url: "/products/kids-cap-01.png" },
    { name: "Pink", hex: "#ffc0cb", image_url: "/products/kids-cap-01.png" }
  ],
  "Pastel Tie-Dye Oversized Tee": [
    { name: "Pastel", hex: "#ffb6c1", image_url: "/products/unisex-tshirt-01.png" },
    { name: "Dark Tie-Dye", hex: "#4b0082", image_url: "/products/unisex-tshirt-01.png" },
    { name: "Earth Tie-Dye", hex: "#8b4513", image_url: "/products/unisex-tshirt-01.png" }
  ],
  "Charcoal Heavyweight Hoodie": [
    { name: "Charcoal", hex: "#36454f", image_url: "/products/unisex-hoodie-01.png" },
    { name: "Navy", hex: "#1f2937", image_url: "/products/unisex-hoodie-01.png" },
    { name: "Beige", hex: "#f5f5dc", image_url: "/products/unisex-hoodie-01.png" }
  ],
  "Forest Crewneck Sweatshirt": [
    { name: "Forest Green", hex: "#228b22", image_url: "/products/unisex-sweatshirt-01.png" },
    { name: "Navy", hex: "#1f2937", image_url: "/products/unisex-sweatshirt-01.png" },
    { name: "Grey", hex: "#808080", image_url: "/products/unisex-sweatshirt-01.png" }
  ],
  "Sand Dad Cap": [
    { name: "Sand", hex: "#c2b280", image_url: "/products/unisex-cap-01.png" },
    { name: "Black", hex: "#111111", image_url: "/products/unisex-cap-01.png" },
    { name: "Olive", hex: "#4b5320", image_url: "/products/unisex-cap-01.png" }
  ]
};

async function addColors() {
  console.log("Adding colors to 15 products...");

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name");

  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }

  let updated = 0;

  for (const p of products) {
    if (colorMappings[p.name]) {
      const { error: updateError } = await supabase
        .from("products")
        .update({ colors: colorMappings[p.name] })
        .eq("id", p.id);

      if (updateError) {
        console.error(`Failed to update ${p.name}:`, updateError);
      } else {
        console.log(`✓ Added 3 colors to ${p.name}`);
        updated++;
      }
    }
  }

  console.log(`\nSuccessfully updated ${updated} products with color variants!`);
}

addColors();
