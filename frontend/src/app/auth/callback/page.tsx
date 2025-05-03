'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (data.session) {
        router.replace("/layout"); 
      } else {
        router.replace("/"); // fallback
      }
    };

    handleAuth();
  }, [router]);

  return <p className="text-white">Logging in...</p>;
}
