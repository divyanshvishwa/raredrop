import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, name, price, remaining_quantity, total_quantity } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (price !== undefined) updates.price = Number(price);
  if (remaining_quantity !== undefined)
    updates.remaining_quantity = Number(remaining_quantity);
  if (total_quantity !== undefined)
    updates.total_quantity = Number(total_quantity);
  if (body.image_url !== undefined) updates.image_url = body.image_url;
  if (body.images !== undefined) updates.images = body.images;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}
