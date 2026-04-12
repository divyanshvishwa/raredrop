"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpHint, setOtpHint] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), action: "send" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        setLoading(false);
        return;
      }
      setSignupStep(2);
      setResendTimer(60);
      if (data.otp) setOtpHint(data.otp);
    } catch {
      setError("Network error. Try again.");
    }
    setLoading(false);
  };

  const verifyOtpAndSignup = async () => {
    setLoading(true);
    setError("");
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Enter the full 6-digit code");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), action: "verify", code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed");
        setLoading(false);
        return;
      }
      // OTP verified — create account
      const { error: signUpError } = await supabaseBrowser.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setError("");
        setMode("login");
        setSignupStep(1);
        setOtp(["", "", "", "", "", ""]);
        setOtpHint("");
        alert("Account created! Check your email to confirm, then sign in.");
      }
    } catch {
      setError("Network error. Try again.");
    }
    setLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    for (let i = 0; i < 6; i++) next[i] = text[i] || "";
    setOtp(next);
    otpRefs.current[Math.min(text.length, 5)]?.focus();
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "login") {
      const { error } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
      }
    } else {
      // Signup step 1: send OTP
      await sendOtp();
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            RAREDROP
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight mt-6">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-sm text-muted">
            {mode === "login"
              ? "Sign in to your account"
              : "Join the limited edition club"}
          </p>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-card py-3.5 text-sm font-medium transition-colors hover:bg-surface disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-4 text-muted uppercase tracking-widest">or</span>
          </div>
        </div>

        {/* Email Form */}
        {mode === "signup" && signupStep === 2 ? (
          /* OTP Verification Step */
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <p className="text-sm text-muted">
                Enter the 6-digit code sent to
              </p>
              <p className="text-sm font-semibold">{email}</p>
            </div>

            {otpHint && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-600 mb-1">
                  Test Mode — Your Code
                </p>
                <p className="text-2xl font-mono font-bold tracking-[0.3em] text-amber-700">
                  {otpHint}
                </p>
              </div>
            )}

            <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-lg border border-border bg-card outline-none transition-colors focus:border-foreground"
                />
              ))}
            </div>

            {error && <p className="text-xs text-red-500 text-center">{error}</p>}

            <button
              onClick={verifyOtpAndSignup}
              disabled={loading || otp.join("").length !== 6}
              className="w-full rounded-lg bg-foreground py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <div className="flex items-center justify-between text-xs text-muted">
              <button
                onClick={() => {
                  setSignupStep(1);
                  setOtp(["", "", "", "", "", ""]);
                  setOtpHint("");
                  setError("");
                }}
                className="hover:text-foreground"
              >
                ← Change email
              </button>
              <button
                onClick={sendOtp}
                disabled={resendTimer > 0 || loading}
                className="hover:text-foreground disabled:opacity-40"
              >
                {resendTimer > 0
                  ? `Resend in ${resendTimer}s`
                  : "Resend code"}
              </button>
            </div>
          </div>
        ) : (
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
              placeholder="Min 6 characters"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-foreground py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Send Verification Code"}
          </button>
        </form>
        )}

        {/* Toggle mode */}
        <p className="text-center text-sm text-muted">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => { setMode("signup"); setError(""); setSignupStep(1); setOtp(["","","","","",""]); setOtpHint(""); }}
                className="font-semibold text-foreground hover:opacity-70"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => { setMode("login"); setError(""); setSignupStep(1); setOtp(["","","","","",""]); setOtpHint(""); }}
                className="font-semibold text-foreground hover:opacity-70"
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
