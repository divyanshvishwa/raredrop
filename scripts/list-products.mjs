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

async function listProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, category, gender, type, remaining_quantity")
    .order("category", { ascending: true });

  if (error) {
    console.error("Error:", error.message);
    return;
  }

  console.log(`\nTotal products: ${data.length}\n`);
  
  // Group by category
  const grouped = {};
  data.forEach((p) => {
    const cat = p.category || "Uncategorized";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  });

  for (const [cat, products] of Object.entries(grouped)) {
    console.log(`\n━━━ ${cat} (${products.length}) ━━━`);
    products.forEach((p) => {
      console.log(`  ${p.name} — ${p.gender || "N/A"} — ${p.type} — stock: ${p.remaining_quantity}`);
    });
  }
}

listProducts();
