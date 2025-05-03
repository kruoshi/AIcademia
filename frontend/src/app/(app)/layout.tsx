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
          <div className="flex h-screen w-screen">
            <Sidebar />
            <div className="w-full h-full">
              <Header />
              <main className=" w-full h-full bg-background  border py-6 lg:py-10 pr-6 pl-6 lg:pr-10 lg:pl-82 overflow-auto ">
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
