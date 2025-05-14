"use client";
import { useState, useEffect } from "react";
import { Bookmark, Clock4, CircleCheckBig } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import LatestCard from "@/components/ui/LatestCard";
import clsx from "clsx";

const ReadingReferences = () => {
  const [page, setPage] = useState("bookmarks");
  const [docs, setDocs] = useState<CapstoneRecord[]>([]);

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

  useEffect(() => {
    const fetchDocs = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase
        .from("capstones")
        .select(
          "id, slug, title, keywords, specialization, abstract, course, authors, created_at"
        )
        .order("created_at", { ascending: false });

      if (!error && data) setDocs(data as CapstoneRecord[]);
      else console.error("Supabase error:", error);
    };

    fetchDocs();
  }, []);

  return (
    <>
      <h1 className="font-arima font-bold text-xl xs:text-2xl sm:text-3xl xl:text-4xl">
        Manage <span className="text-secondary-dark">Readings</span>
      </h1>
      <ul className="flex mt-10 ring-2 ring-secondary-darker bg-secondary rounded-md overflow-hidden font-roboto w-fit">
        <li
          className={clsx(
            "flex gap-3 py-1.5 px-8 items-center text-xl font-bold hover:bg-secondary-dark cursor-pointer",
            page === "bookmarks" && "bg-secondary-dark"
          )}
          onClick={() => setPage("bookmarks")}
        >
          <Bookmark strokeWidth={3} />
          <span>Bookmark</span>
        </li>
        <li
          className={clsx(
            "flex gap-3 py-1.5 px-8 items-center text-xl font-bold hover:bg-secondary-dark cursor-pointer",
            page === "have-read" && "bg-secondary-dark"
          )}
          onClick={() => setPage("have-read")}
        >
          <CircleCheckBig strokeWidth={3} />
          <span>Have Read</span>
        </li>
        <li
          className={clsx(
            "flex gap-3 py-1.5 px-8 items-center text-xl font-bold hover:bg-secondary-dark cursor-pointer",
            page === "to-read" && "bg-secondary-dark"
          )}
          onClick={() => setPage("to-read")}
        >
          <Clock4 strokeWidth={3} />
          <span>To Read</span>
        </li>
      </ul>
      <ul className="mt-8 grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10 font-roboto">
        {docs.slice(1).map((doc) => (
          <li key={doc.id} className="h-40 xs:h-45 sm:h-50 md:h-60">
            <LatestCard
              id={doc.id}
              title={doc.title}
              specialization={doc.specialization}
              course={doc.course}
              date={new Date(doc.created_at).toLocaleDateString()}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default ReadingReferences;
