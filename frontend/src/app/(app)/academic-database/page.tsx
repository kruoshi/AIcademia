import Card from "@/components/ui/SearchCard";
import CardRow from "@/components/ui/CardRow";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function AcademicDatabase() {
  const supabase = createServerComponentClient({ cookies });
  const { data: capstones, error } = await supabase.from("capstones").select(
    "id, slug, title, created_at, status, keywords, profile_id",
  )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching capstones:", error.message);
    return <div>Error loading capstones</div>;
  }

  return (
    <>
      <h1 className="font-arima font-bold text-xl xs:text-2xl sm:text-3xl xl:text-4xl">
        Explore <span className="text-secondary-dark">Academic Works</span>
      </h1>
      <div className="w-full">
        <p className="xl:font-bold font-medium font-roboto mt-5 text-sm md:text-base xl:text-lg">
          Recently Added
        </p>

        <div className="mt-3 overflow-x-auto pb-2 grid grid-flow-col auto-cols-[150px] xs:auto-cols-[180px] sm:auto-cols-[225px] xl:auto-cols-[250px]  gap-3 md:gap-4">
          {capstones.slice(0, 5).map((item) => (
            <Link href={`/capstones/${item.slug}`} key={item.id}>
              <Card
                id={item.id}
                title={item.title}
                specialization={item.keywords?.[1] || "N/A"}
                course={item.keywords?.[0] || "IT"}
                date={new Date(item.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })}
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center xl:font-bold font-medium font-roboto mt-6 text-sm md:text-base xl:text-lg ">
          <p>Uploaded Papers</p>
          <Link
            href="/academic-database/view-all"
            className="text-[10px] md:text-xs xl:text-sm font-semibold text-text-dark"
          >
            View All
          </Link>
        </div>
        <div className="flex-1 mt-3 overflow-y-auto pb-2">
          <div className="flex-col flex gap-0.5">
            {capstones.slice(0, 10).map((item) => (
              <Link href={`/capstones/${item.slug}`} key={item.id}>
                <CardRow
                  title={item.title}
                  specialization={item.keywords?.[1] || "General"}
                  course={item.keywords?.[0] || "IT"}
                  date={new Date(item.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
