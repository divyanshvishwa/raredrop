// One-shot script: ensure admin user exists with the given password.
// Usage: node scripts/reset-admin.mjs <email> <newPassword>
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const [, , email, password] = process.argv;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
if (!email || !password) {
  console.error("Usage: node scripts/reset-admin.mjs <email> <newPassword>");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: list, error: listErr } = await admin.auth.admin.listUsers({
  page: 1,
  perPage: 200,
});
if (listErr) {
  console.error("listUsers failed:", listErr.message);
  process.exit(1);
}

const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

if (existing) {
  const { error } = await admin.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
  });
  if (error) {
    console.error("Update failed:", error.message);
    process.exit(1);
  }
  console.log(`Updated password for existing user: ${email}`);
} else {
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    console.error("Create failed:", error.message);
    process.exit(1);
  }
  console.log(`Created new admin user: ${email}`);
}

console.log("Done. You can now log in at /admin/login");
