import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send OTP email via Resend
    const { error: emailError } = await resend.emails.send({
      from: "RAREDROP <onboarding@resend.dev>",
      to: sanitizedEmail,
      subject: "Your RAREDROP Verification Code",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 8px;">RAREDROP</h1>
          <p style="color: #666; font-size: 14px; margin: 0 0 32px;">Limited Edition. Never Restocked.</p>
          <p style="font-size: 14px; color: #333; margin: 0 0 24px;">Your verification code is:</p>
          <div style="background: #f5f5f5; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: monospace;">${otp}</span>
          </div>
          <p style="font-size: 13px; color: #999; margin: 0;">This code expires in 10 minutes. Don't share it with anyone.</p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend email error:", emailError);
      return NextResponse.json({ error: "Failed to send verification email", details: emailError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
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
