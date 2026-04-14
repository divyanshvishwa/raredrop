"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/use-auth";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function EditProfilePage() {
  const { user, loading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Populate form when user loads
  useState(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || "");
      setPhone(user.user_metadata?.phone || "");
    }
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  // Initialize form values from user on first render
  if (fullName === "" && user.user_metadata?.full_name) {
    setFullName(user.user_metadata.full_name);
  }
  if (phone === "" && user.user_metadata?.phone) {
    setPhone(user.user_metadata.phone);
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const { error: updateError } = await supabaseBrowser.auth.updateUser({
      data: { full_name: fullName.trim(), phone: phone.trim() },
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      setPasswordSaving(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      setPasswordSaving(false);
      return;
    }

    const { error: pwError } = await supabaseBrowser.auth.updateUser({
      password: newPassword,
    });

    if (pwError) {
      setPasswordError(pwError.message);
    } else {
      setPasswordSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    }
    setPasswordSaving(false);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-16">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-muted hover:text-foreground transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">
              My Account
            </p>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Edit Profile
          </h1>
          <p className="text-sm text-muted">{user.email}</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} className="mt-12 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              Email
            </label>
            <input
              type="email"
              value={user.email || ""}
              disabled
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted outline-none cursor-not-allowed"
            />
            <p className="text-[10px] text-muted">Email cannot be changed</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); setSuccess(false); }}
              placeholder="Your full name"
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setSuccess(false); }}
              placeholder="+91 XXXXX XXXXX"
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
          {success && <p className="text-xs text-green-600">Profile updated successfully!</p>}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Change Password */}
        <div className="mt-16 border-t border-border pt-12">
          <h2 className="text-xl font-extrabold tracking-tight mb-1">
            Change Password
          </h2>
          <p className="text-sm text-muted mb-8">Update your account password</p>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setPasswordSuccess(false); }}
                placeholder="Min 6 characters"
                minLength={6}
                required
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordSuccess(false); }}
                placeholder="Repeat new password"
                required
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
              />
            </div>

            {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
            {passwordSuccess && <p className="text-xs text-green-600">Password updated successfully!</p>}

            <button
              type="submit"
              disabled={passwordSaving}
              className="rounded-lg border border-border px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted transition-colors hover:border-foreground hover:text-foreground disabled:opacity-50"
            >
              {passwordSaving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
