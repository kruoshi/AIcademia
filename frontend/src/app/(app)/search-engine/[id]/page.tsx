"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Book,
  Bookmark,
  Calendar,
  CircleCheckBig,
  Clock4,
  GraduationCap,
} from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

const supabase = createClientComponentClient();

export default function CapstonePage() {
  const params = useParams() as { id: string };
  const id = params.id;
  const [capstone, setCapstone] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recommend-capstones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: capstone.title,
          keywords: capstone.keywords,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await res.json();
      setRecommendations(data);
    } catch (error) {
      console.error("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCapstone = async () => {
      const { data, error } = await supabase
        .from("capstones")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch capstone:", error);
      } else {
        setCapstone(data);
      }
    };

    if (id) fetchCapstone();
  }, [id]);

  if (!capstone) {
    return <p className="p-6 text-gray-500">Loading capstone data...</p>;
  }

  return (
    <div className="p-10 max-w-4xl mx-auto font-roboto">
      <h1 className="text-3xl font-extrabold mb-2 leading-snug">
        {capstone.title}
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        {capstone.authors?.map((author: any, index: number) => (
          <span key={index}>
            {author.name}, {" "}
          </span>
        ))}
      </p>

      <ul className="flex flex-col sm:flex-row gap-4 text-sm text-gray-700 mb-6">
        <li className="flex items-center gap-2">
          <GraduationCap className="size-4" />
          BS {capstone.course}
        </li>
        <li className="flex items-center gap-2">
          <Book className="size-4" />
          {capstone.specialization}
        </li>
        <li className="flex items-center gap-2">
          <Calendar className="size-4" />
          {new Date(capstone.published_at || capstone.created_at)
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
        </li>
      </ul>

      <ul className="flex gap-6 mb-6">
        <li>
          <Bookmark className="size-5" />
        </li>
        <li>
          <Clock4 className="size-5" />
        </li>
        <li>
          <CircleCheckBig className="size-5" />
        </li>
      </ul>

      <div className="flex gap-4 mb-6">
        <button
          className="bg-yellow-400 px-4 py-2 font-semibold rounded"
          onClick={fetchRecommendations}
        >
          See Recommendations
        </button>
        <a
          href={capstone.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-900 text-white px-4 py-2 font-semibold rounded"
        >
          View PDF
        </a>
      </div>

      <div className="prose max-w-none">
        <h2 className="text-xl font-bold mb-2">Abstract</h2>
        <p>{capstone.abstract}</p>

        {recommendations.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Recommendations</h3>
            {recommendations.slice(1).map((item) => (
              <Link href={`/search-engine/${item.id}`} key={item.id}>
                <p className="bg-white py-2 px-8 shadow-sm/10 w-full mb-2">
                  {item.title}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
