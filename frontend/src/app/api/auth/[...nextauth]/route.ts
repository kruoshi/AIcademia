// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth({
  ...authOptions,
  callbacks: {
    async signIn({ user }) {
      return user.email?.endsWith("@ust.edu.ph") ?? false;
    },
  },
  events: {
    async signIn({ user, account }) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
  
      await supabaseAdmin.from("profiles").upsert({
        user_id: user.id || account?.providerAccountId,
        email: user.email,
        created_at: new Date().toISOString(),
      });
    },
  },
});

export const dynamic = "force-dynamic";
export { handler as GET, handler as POST };
