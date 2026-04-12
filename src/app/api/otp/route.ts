import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, action, code } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const sanitizedEmail = email.trim().toLowerCase();

  // --- SEND OTP ---
  if (action === "send") {
    // Rate limit: check if OTP was sent recently
    const { data: existing } = await supabaseAdmin
      .from("otps")
      .select("created_at")
      .eq("email", sanitizedEmail)
      .single();

    if (existing) {
      const age = Date.now() - new Date(existing.created_at).getTime();
      if (age < 60_000) {
        return NextResponse.json(
          { error: "Please wait before requesting a new OTP" },
          { status: 429 }
        );
      }
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Delete old OTPs, then insert new one
    await supabaseAdmin.from("otps").delete().eq("email", sanitizedEmail);

    const { error: insertError } = await supabaseAdmin.from("otps").insert({
      email: sanitizedEmail,
      code: otp,
      expires_at: expiresAt,
    });

    if (insertError) {
      console.error("OTP insert error:", insertError);
      return NextResponse.json({ error: "Failed to generate OTP" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent",
      // Return OTP directly — in production, send via email service instead
      otp,
    });
  }

  // --- VERIFY OTP ---
  if (action === "verify") {
    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "OTP code is required" }, { status: 400 });
    }

    const { data: otpRecord } = await supabaseAdmin
      .from("otps")
      .select("*")
      .eq("email", sanitizedEmail)
      .eq("code", code.trim())
      .single();

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    if (new Date(otpRecord.expires_at) < new Date()) {
      await supabaseAdmin.from("otps").delete().eq("email", sanitizedEmail);
      return NextResponse.json({ error: "Code expired. Request a new one." }, { status: 400 });
    }

    // Valid — delete so it can't be reused
    await supabaseAdmin.from("otps").delete().eq("email", sanitizedEmail);

    return NextResponse.json({ verified: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
