import { Search } from "lucide-react";
import Card from "@/components/ui/Card";
import Keywords from "@/components/ui/Keywords";

const SearchEngine = () => {
  return (
    <div className=" flex flex-col h-full sm:pt-9 lg:pt-19 ">
      <div className="flex flex-col">
        <div className="text-center">
          <h1 className="font-arima font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl xl:text-5xl">
            Discover <span className="text-secondary-dark">Academic</span> works
            <br />
            done by the UST Community
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
              className="placeholder:text-text-dark pl-8 pr-2 py-1 w-60 sm:w-100 ring-2 ring-secondary focus:outline-none rounded-md border-secondary-dark text-[10px] xs:text-[11px] sm:text-xs sm:pl-10 xl:pl-14 md:text-sm xl:text-base font-medium font-roboto auto-complete-none"
            />
          </div>
        </div>
        <div className="font-roboto flex flex-wrap items-center mx-auto sm:w-5/6 justify-center gap-2 mt-3 sm:mt-5 font-medium text-[10px] xs:text-[11px] sm:text-xs md:text-sm">
          <Keywords />
          <Keywords />
          <Keywords />
          <Keywords />
          <Keywords />
          <Keywords />
        </div>
      </div>
      <div className="flex-1 mt-8 overflow-y-auto ">
        <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 sm:px-5 xl:px-10 2xl:px-20 gap-3 sm:gap-5 h-full content-start font-roboto">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </ul>
      </div>
    </div>
  );
};

export default SearchEngine;
