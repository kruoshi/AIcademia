import { Search, ArrowUpRight } from "lucide-react";
import CourseCard from "@/components/ui/CourseCard";
import DocItems from "@/lib/constants/DocItems";
import CitedCard from "@/components/ui/CitedCard";
import Link from "next/link";
import LatestCard from "@/components/ui/LatestCard";

const AcademicDatabase = () => {
  return (
    <>
      <h1 className="font-arima font-bold text-xl xs:text-2xl sm:text-3xl xl:text-5xl">
        Explore <span className="text-secondary-dark">Academic Works</span>
      </h1>
      <div className="flex sm:flex-row flex-col gap-2 sm:gap-5 items-start sm:items-center my-3 sm:my-5 ">
        <div className="relative w-full sm:w-fit">
          <Search
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 size-4 md:size-5   text-text"
            strokeWidth={2.5}
          />
          <input
            type="text"
            name="search"
            placeholder="Search for document"
            className="pl-10 sm:pl-13 pr-8 py-2 sm:py-3 border w-full sm:w-100 xl:w-125 3xl:w-150 bg-white border-zinc-200 shadow-md/5 focus:outline-none rounded-full text-xs md:text-sm 2xl:text-lg font-medium font-roboto"
            autoComplete="none"
          />
        </div>
        <Link
          href="/publications/catalog"
          className="bg-secondary px-6 py-2 sm:py-3 rounded-full flex gap-3 items-center font-black text-text border border-secondary-dark/30 font-roboto shadow-md/5  cursor-pointer text-xs md:text-sm 2xl:text-lg"
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

        <div className="mt-2 overflow-x-auto mb-2 flex flex-nowrap gap-3 md:gap-10 font-roboto no-scrollbar">
          <CourseCard />
          <CourseCard />
          <CourseCard />
        </div>
      </div>
      <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row gap-8 mt-8 w-full">
        <div className="w-full md:w-3/5 lg:w-full xl:w-3/5 2xl:w-3/4">
          <p className="font-bold text-text font-roboto mb-4 text-base sm:text-lg xl:text-xl ">
            Latest Publications
          </p>
          <ul className="mt-2 grid grid-cols-1  xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-3 font-roboto ">
            {DocItems.map((doc) => (
              <li key={doc.id} className="h-40 xs:h-45 sm:h-50 md:h-60">
                <LatestCard
                  id={doc.id}
                  title={doc.title}
                  specialization={doc.specialization}
                  date={doc.date}
                  course={doc.course}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full  md:w-2/5 lg:w-full xl:w-2/5 2xl:w-1/4">
          <p className="font-bold text-text font-roboto mb-4 text-base sm:text-lg xl:text-xl ">
            Top-Cited
          </p>
          <ul className="mt-2 grid grid-cols-1 gap-4 font-roboto px-3 py-5 bg-white rounded-md shadow-md/5 ">
            {DocItems.slice(0, 5).map((doc, index) => (
              <li key={doc.id}>
                <CitedCard id={doc.id} title={doc.title} index={index + 1} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default AcademicDatabase;
