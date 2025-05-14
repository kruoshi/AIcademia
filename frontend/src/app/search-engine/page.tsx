import { Search } from "lucide-react";
import SearchCard from "@/components/ui/SearchCard";
import DocItems from "@/lib/constants/DocItems";

const SearchEngine = () => {
  return (
    <>
      <div className="text-center md:pt-15">
        <h1 className="font-arima font-bold text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-6xl">
          Discover <span className="text-secondary-dark">Academic</span> works
          <br />
          done by the UST Community
        </h1>
        <p className="font-roboto text-text-dark font-medium text-[11px] xs:text-xs sm:text-sm md:text-lg xl:text-xl lg:mt-2">
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
            className="placeholder:text-text-dark pl-8 pr-2 py-1 w-60 sm:w-100 md:w-150 ring-2 ring-secondary focus:outline-none rounded-md border-secondary-dark text-sm sm:text-base sm:pl-10 xl:pl-14 md:text-lg xl:text-xl font-medium font-roboto auto-complete-none"
          />
        </div>
      </div>

      <ul className=" mt-10 columns-1 sm:columns-2 2xl:columns-3 4xl:columns-4 sm:px-5 xl:px-10 2xl:px-20 gap-3 pb-5">
        {DocItems.map((doc) => (
          <li key={doc.id}>
            <SearchCard
              id={doc.id}
              title={doc.title}
              specialization={doc.specialization}
              course={doc.course}
              date={doc.date}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default SearchEngine;
