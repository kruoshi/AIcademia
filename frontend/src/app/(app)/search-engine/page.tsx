"use client";

import { Search } from "lucide-react";
import SearchCard from "@/components/ui/SearchCard";
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
  similarity_score?: number;
  abstract: string;
  course: string;
  authors: string;
  published_at?: string;
  created_at: string;
};

const SearchEngine: React.FC = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [embeddingStatus, setEmbeddingStatus] = useState("");
  const [searchResults, setSearchResults] = useState<CapstoneResult[]>([]);

  // Run ingestion on mount
  useEffect(() => {
    fetch("/api/ingest")
      .then((res) => res.json())
      .then((data) => console.log("Ingest result:", data))
      .catch(console.error);
  }, []);

  // Run embedding check on mount
  useEffect(() => {
    const runInitialEmbedding = async () => {
      setIsEmbedding(true);
      setEmbeddingStatus("Checking embeddings...");

      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { count: capstoneCount } = await supabase
          .from("capstones")
          .select("*", { count: "exact", head: true });

        const { count: embedCount } = await supabase
          .from("capstones")
          .select("*", { count: "exact", head: true });

        if (capstoneCount === 0) {
          setEmbeddingStatus("No capstones found to embed");
          return;
        }

        if (embedCount === 0 || embedCount < capstoneCount) {
          setEmbeddingStatus(
            `Updating embeddings (${embedCount || 0}/${capstoneCount})...`
          );
          const response = await fetch("/api/embed", { method: "POST" });
          const data = await response.json();
          setEmbeddingStatus(
            `Embeddings updated: ${data.count} items processed`
          );
        } else {
          setEmbeddingStatus("Embeddings up to date");
        }
      } catch (error) {
        console.error("Embedding error:", error);
        setEmbeddingStatus("Error updating embeddings");
      } finally {
        setIsEmbedding(false);
      }
    };

    runInitialEmbedding();
  }, []);

  // Query search results
  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const vectorRes = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        if (vectorRes.ok) {
          const vectorResults = await vectorRes.json();

          // fallback or augmentation logic (e.g., add fuzzy matches)
          const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );

          const { data: supaResults, error } = await supabase
            .from("capstones")
            .select(
              "id, slug, title, abstract, keywords, specialization, course, authors, created_at"
            )
            .ilike("title", `%${query}%`);

          console.log("Query value:", query);

          // Get full details for vectorResults
          const vectorIds = vectorResults.map((v: any) => v.id);
          const { data: fullVectorResults, error: vectorError } = await supabase
            .from("capstones")
            .select(
              "id, slug, title, abstract, keywords, specialization, course, authors, created_at"
            )
            .in("id", vectorIds);

          if (vectorError)
            console.error("Error fetching full vector data:", vectorError);

          // Merge results: full vector results first, then extra supabase matches
          const combinedResults = [
            ...(fullVectorResults || []),
            ...(supaResults || []).filter((s) => !vectorIds.includes(s.id)),
          ];

          setSearchResults(combinedResults);
          if (error) console.error(error);
        } else {
          const errorData = await vectorRes.json();
          console.error(errorData.error);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(debounceTimer);
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
        {isEmbedding && (
          <p className="text-xs text-gray-500 mt-2">{embeddingStatus}</p>
        )}
      </div>

      <ul className="mt-10 columns-1 sm:columns-2 xl:columns-3 sm:px-5 xl:px-10 2xl:px-20 gap-5 pb-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <li key={i}>
                <SearchCardSkeleton />
              </li>
            ))
          : searchResults.map((doc) => {
              console.log("Abstract:", doc); // Log the abstract of each document

              return (
                <Link
                  href={`search-engine/${doc.id}`}
                  key={doc.id}
                  className="cursor-pointer"
                >
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
                </Link>
              );
            })}
      </ul>
    </>
  );
};

export default SearchEngine;
