"use client";

import { Search } from "lucide-react";
import SearchCard from "@/components/ui/SearchCard";
import Keywords from "@/components/ui/Keywords";
import { useEffect, useState } from "react";
import SearchCardSkeleton from "@/components/ui/SkeletonSearchCard";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

type CapstoneResult = {
  id: string;
  slug: string;
  title: string;
  keywords: string[];
  specialization: string;
  course: string;
  published_at: string;
  similarity_score?: number;
  created_at: string;
};

const SearchEngine: React.FC = () => {
  const [searchResults, setSearchResults] = useState<CapstoneResult[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const results = await res.json();
      if (res.ok) {
        setSearchResults(results);
      } else {
        console.error(results.error);
      }
    };

    fetchSearchResults();
  }, [query]);
  
  return (
    <>
      <div className="text-center md:pt-10">
        <h1 className="font-arima font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl xl:text-5xl">
          Discover <span className="text-secondary-dark">Academic</span> works
          <br /> done by the UST Community
        </h1>
        <p className="font-roboto text-text-dark font-medium text-[11px] xs:text-xs sm:text-sm md:text-base xl:text-lg lg:mt-2">
          Browse through various documented projects.{" "}
          <br className="xl:hidden" />
          <span className="text-secondary-dark font-semibold">
            Looking for related literatures?
          </span>
        </p>
        <div className="relative flex w-fit mt-5 sm:mt-8 mx-auto justify-center">
          <Search
            className="absolute left-2 top-1/2 -translate-y-1/2 text-text-dark size-3.5 sm:size-4 xl:size-5"
            strokeWidth={2.5}
          />
          <input
            type="text"
            name="search"
            placeholder="Search for related academic projects"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="placeholder:text-text-dark pl-8 pr-2 py-1 w-60 sm:w-100 ring-2 ring-secondary focus:outline-none rounded-md border-secondary-dark text-[10px] xs:text-[11px] sm:text-xs sm:pl-10 xl:pl-14 md:text-sm xl:text-base font-medium font-roboto auto-complete-none"
          />
        </div>
      </div>

      <div className="font-roboto flex flex-wrap items-center mx-auto sm:w-5/6 justify-center gap-2 mt-3 sm:mt-5 font-medium text-[10px] xs:text-[11px] sm:text-xs md:text-sm ">
        <Keywords />
        <Keywords />
        <Keywords />
        <Keywords />
        <Keywords />
        <Keywords />
      </div>

      <ul className="mt-10 columns-1 sm:columns-2 xl:columns-3 sm:px-5 xl:px-10 2xl:px-20 gap-5 pb-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <li key={i}>
                <SearchCardSkeleton />
              </li>
            ))
          : searchResults.map((doc) => {
              console.log("Document object:", doc); // Log the entire doc object
              console.log("created_at raw value:", doc.created_at); // Log created_at
              return (
                <Link
                  href={`/capstones/${doc.id}`}
                  key={doc.id}
                  className="block hover:opacity-90 transition cursor-pointer"
                >
                  <li>
                    <SearchCard
                      id={doc.id}
                      title={doc.title}
                      specialization={doc.keywords?.[1] || "General"}
                      course={doc.keywords?.[0] || "IT"}
                      date={new Date(doc.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    />
                  </li>
                </Link>
              );
            })}
      </ul>



      <button className="mt-10 mx-auto block text-center text-lg px-8 py-1.5 rounded-full font-semibold bg-secondary-dark">
        Show More
      </button>
    </>
  );
};

export default SearchEngine;
