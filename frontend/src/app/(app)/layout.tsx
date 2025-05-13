import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Providers from "@/lib/context/provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AppLayout(
  { children }: { children: React.ReactNode },
) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const currentUser = session.user;
  return (
    <Providers>
      {currentUser
        ? (
          <div className="flex ">
            <Sidebar />
            <div className="min-h-screen w-screen">
              <Header />
              <main className="bg-background h-full py-6 lg:py-14 pr-6 pl-6 lg:pr-14 lg:pl-86 3xl:pl-99">
                {children}
              </main>
            </div>
          </div>
        )
        : (
          <main className="w-screen h-screen overflow-hidden">
            {children}
          </main>
        )}
    </Providers>
  );
}
