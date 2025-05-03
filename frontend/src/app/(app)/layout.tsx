import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Providers from "@/lib/context/provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <Providers>
      <div className="flex h-screen w-screen">
        <Sidebar />
        <div className="w-full h-full">
          <Header />
          <main className="p-6 overflow-auto w-full h-full bg-background">{children}</main>
        </div>
      </div>
    </Providers>
  );
}