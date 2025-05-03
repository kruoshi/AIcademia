"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        const queryString = window.location.search;
        const { error } = await supabase.auth.exchangeCodeForSession(queryString);

        if (error) {
          console.error("Exchange error:", error.message);
          router.replace("/");
          return;
        }
      }

      router.replace("/search-engine");
    });
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-background text-white">
      <p>Logging in...</p>
    </div>
  );
}
