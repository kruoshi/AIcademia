"use client";
import { useFilter } from "@/lib/context/FIlterContext";
import { Filter, ListFilter } from "lucide-react";

interface Props {
  type: string;
}

const FilterBtn: React.FC<Props> = ({ type }) => {
  const { openFilter } = useFilter();
  return (
    <div
      className="flex bg-white gap-2 w-full justify-center sm:px-8 py-2 rounded-sm items-center border border-zinc-200 shadow-md/5"
      onClick={() => openFilter(type)}
    >
      {type === "Filter" ? (
        <Filter
          strokeWidth={2}
          className="size-4 xs:size-4.5 sm:size-5 block md:hidden"
        />
      ) : (
        <ListFilter
          strokeWidth={2}
          className="size-4 xs:size-4.5 sm:size-5 block md:hidden"
        />
      )}
      <span className="font-medium text-xs xs:text-sm text-text">{type}</span>
    </div>
  );
};

export default FilterBtn;
