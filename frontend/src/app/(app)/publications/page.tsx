"use client";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowUpRight, Search } from "lucide-react";
import CourseCard from "@/components/ui/CourseCard";
import CitedCard from "@/components/ui/CitedCard";
import LatestCard from "@/components/ui/LatestCard";
import CapstoneSidebar from "@/components/ui/CapstoneSidebar";
import Link from "next/link";
import { DEGREE_STRUCTURE } from "@/lib/constants/DegreeStructure";

type CourseStats = {
  course: string;
  total: number;
  specializations: {
    name: string;
    count: number;
  }[];
};

const fetchCourseStats = async (): Promise<CourseStats[]> => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase
    .from("capstones")
    .select("course, specialization");

  if (error || !data) {
    console.error("Supabase error:", error);
    return [];
  }

  const result: CourseStats[] = Object.entries(DEGREE_STRUCTURE).map(
    ([course, specs]) => {
      const specializationCounts = specs.map((spec) => {
        const count = data.filter(
          (row) =>
            row.course === course &&
            row.specialization === spec,
        ).length;

        return {
          name: spec,
          count,
        };
      });

      const total = specializationCounts.reduce((sum, s) => sum + s.count, 0);

      return {
        course,
        total,
        specializations: specializationCounts,
      };
    },
  );

  return result;
};
type CapstoneRecord = {
  id: string;
  slug: string;
  title: string;
  keywords: string[];
  specialization: string;
  abstract: string;
  course: string;
  authors: string;
  published_at: string;
  created_at: string;
};

const AcademicDatabase = () => {
  const [docs, setDocs] = useState<CapstoneRecord[]>([]);
  const [selectedCapstone, setSelectedCapstone] = useState<
    CapstoneRecord | null
  >(null);

  useEffect(() => {
    const fetchDocs = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );

      const { data, error } = await supabase
        .from("capstones")
        .select(
          "id, slug, title, keywords, specialization, abstract, course, authors, created_at",
        )
        .order("created_at", { ascending: false });

      if (!error && data) setDocs(data as CapstoneRecord[]);
      else console.error("Supabase error:", error);
    };

    fetchDocs();
  }, []);

  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);

  useEffect(() => {
    fetchCourseStats().then(setCourseStats);
  }, []);

  return (
    <>
      <h1 className="font-arima font-bold text-xl xs:text-2xl sm:text-3xl xl:text-4xl">
        Explore <span className="text-secondary-dark">Academic Works</span>
      </h1>

      <div className="flex sm:flex-row flex-col gap-2 sm:gap-5 items-start sm:items-center my-3 sm:my-5">
        <div className="relative w-full sm:w-fit">
          <Search
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 size-4 md:size-5 text-text"
            strokeWidth={2.5}
          />
          <input
            type="text"
            name="search"
            placeholder="Search for document"
            className="pl-10 sm:pl-13 pr-8 py-2 sm:py-3 border w-full sm:w-100 xl:w-125 3xl:w-150 bg-white border-zinc-200 shadow-md/5 focus:outline-none rounded-full text-xs md:text-sm 2xl:text-base font-medium font-roboto"
            autoComplete="off"
          />
        </div>
        <Link
          href="/publications/catalog"
          className="bg-secondary px-6 py-2 rounded-full flex gap-3 items-center font-black text-text border border-secondary-dark/30 font-roboto shadow-md/5 h-full cursor-pointer text-xs md:text-sm 2xl:text-base"
        >
          <span>View Catalog</span>
          <ArrowUpRight
            strokeWidth={2.5}
            className="size-4 md:size-5 2xl:size-6"
          />
        </Link>
      </div>

      <div className="w-full">
        <p className="font-bold text-text font-roboto my-4 text-base sm:text-lg xl:text-xl 3xl:text-2xl">
          Courses
        </p>
        <div className="mt-2 w-full overflow-x-auto mb-2 flex flex-nowrap gap-3 md:gap-10 p-0.5 font-roboto">
          {courseStats.map((stat) => (
            <CourseCard
              key={stat.course}
              course={stat.course}
              total={stat.total}
              specializations={stat.specializations}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="font-bold text-text font-roboto mb-4 text-base sm:text-lg xl:text-xl 2xl:text-2xl">
          Latest Publications
        </p>
        <ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-1 font-roboto">
          {docs.map((doc) => (
            <li key={doc.id} className="h-50 sm:h-60 3xl:h-70">
              <LatestCard
                id={doc.id}
                title={doc.title}
                specialization={doc.specialization}
                course={doc.course}
                date={new Date(doc.created_at).toLocaleDateString()}
                onClick={() => setSelectedCapstone(doc)}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <p className="font-bold text-text font-roboto mb-4 text-base sm:text-lg xl:text-xl 2xl:text-2xl">
          Top-Cited
        </p>
        <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 font-roboto">
          {docs.slice(0, 4).map((doc, index) => (
            <li key={doc.id}>
              <CitedCard
                id={doc.id}
                title={doc.title}
                index={index + 1}
                onClick={() => setSelectedCapstone(doc)}
              />
            </li>
          ))}
        </ul>
      </div>
      {selectedCapstone && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedCapstone(null)}
          />
          <div
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-white shadow-lg overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CapstoneSidebar
              capstone={selectedCapstone}
              onClose={() => setSelectedCapstone(null)}
            />
          </div>
        </>
      )}
    </>
  );
};

export default AcademicDatabase;
