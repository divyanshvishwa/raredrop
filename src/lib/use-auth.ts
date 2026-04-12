"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

export function useAuth(redirectTo = "/login") {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        if (!user) {
          router.replace(redirectTo);
        } else {
          setUser(user);
        }
      } catch {
        // Network error reaching Supabase — redirect to login
        router.replace(redirectTo);
      }
      setLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          router.replace(redirectTo);
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router, redirectTo]);

  const signOut = async () => {
    await supabaseBrowser.auth.signOut();
    router.replace("/login");
  };

  return { user, loading, signOut };
}
