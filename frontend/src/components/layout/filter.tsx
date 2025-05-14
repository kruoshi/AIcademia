"use client";
import { useFilter } from "@/lib/context/FIlterContext";
import YearInput from "../ui/YearInput";
import FilterButton from "../ui/FilterButton";
import clsx from "clsx";

const documentList: string[] = [
  "Joint Issuances",
  "Implementing Rules and Regulations",
  "General Memorandum Orders",
  "General Memorandum Circulars",
  "General Circulars",
  "Citizen's Charters",
  "General Administrative Orders",
  "Circulars",
  "Circular Orders",
  "Brochures and Manuals",
  "Administrative Orders",
];

const Filter: React.FC = () => {
  const { filter, closeFilter, layout } = useFilter();
  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 bg-black opacity-70 z-30 md:hidden",
          filter ? "block" : "hidden"
        )}
        onClick={closeFilter}
      ></div>
      <aside
        className={clsx(
          "font-ibm ml-0.5 mb-2 fixed flex flex-col w-11/12 py-4 px-3 rounded-xl bg-white bottom-1 transition-all duration-300 ease-in-out z-40",
          filter && layout === "Filter"
            ? "min-h-2/4 max-h-2/4 "
            : filter
            ? "min-h-fit max-h-fit"
            : "hidden"
        )}
      >
        {layout === "Filter" ? (
          <>
            <span className="text-primary absolute left-3 font-bold text-sm">
              Reset
            </span>

            <h1 className="text-center font-bold text-base">Filters</h1>
            <span className="font-medium text-xs mt-3">Year Range</span>
            <div className="flex gap-3  w-full my-2">
              <YearInput />
              <YearInput />
            </div>
            <span className="font-medium text-xs mt-2">Document Type</span>
            <ul className="flex-1 flex min-h-0 overflow-y-auto gap-2 flex-wrap py-1 mt-2 mb-4">
              {documentList.length > 0 ? (
                documentList.map((item, index) => (
                  <li
                    key={index}
                    className="cursor-pointer w-fit h-fit  rounded-3xl border border-accent bg-white text-[10px] px-2 py-1 font-medium"
                  >
                    {item}
                  </li>
                ))
              ) : (
                <div className="w-full bg-grey rounded-sm py-2 font-medium text-center text-xs">
                  No Existing Document Type
                </div>
              )}
            </ul>
            <FilterButton />
          </>
        ) : (
          <>
            <h1 className="text-center font-bold text-base ">Sort</h1>
            <ul className="w-full my-4 flex flex-col gap-1.5">
              <li className="flex p-2 rounded-sm items-center hover-bg-zinc-100 justify-between">
                <label htmlFor="" className="text-sm font-semibold">
                  Newest
                </label>
                <input type="radio" className="size-4 accent-primary" />
              </li>
              <li className="flex p-2 rounded-sm items-center hover-bg-zinc-100 justify-between">
                <label htmlFor="" className="text-sm font-semibold">
                  Oldest
                </label>
                <input type="radio" className="size-4 accent-primary" />
              </li>
              <li className="flex p-2 rounded-sm items-center hover-bg-zinc-100 justify-between">
                <label htmlFor="" className="text-sm font-semibold">
                  Order: A to Z
                </label>
                <input type="radio" className="size-4 accent-primary" />
              </li>
              <li className="flex p-2 rounded-sm items-center hover-bg-zinc-100 justify-between">
                <label htmlFor="" className="text-sm font-semibold">
                  Order: Z to A
                </label>
                <input type="radio" className="size-4 accent-primary" />
              </li>
            </ul>
            <FilterButton />
          </>
        )}
      </aside>
    </>
  );
};

export default Filter;
