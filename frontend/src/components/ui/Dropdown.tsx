"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import YearInput from "./YearInput";
import FilterButton from "./FilterButton";

interface DropProps {
  type: string;
  name: string;
  list?: string[];
  icon?: React.JSX.Element;
}

const Dropdown: React.FC<DropProps> = ({ type, name, icon, list }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className=" cursor-pointer flex justify-between md:justify-normal text-sm font-medium items-center w-full md:w-fit md:gap-5 rounded-sm p-2 bg-white border border-zinc-200 shadow-md/5 text-text"
        onClick={() => setOpen(!isOpen)}
      >
        <div className="flex gap-2 items-center">
          {icon}
          <span className="font-medium text-xs 2xl:text-sm ">{name}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="size-4 2xl:size-5" strokeWidth={2.5} />
        ) : (
          <ChevronDown className="size-4 2xl:size-5" strokeWidth={2.5} />
        )}
      </button>
      {isOpen && (
        <div className="absolute mt-2.5 ring-1 ring-accent rounded-sm bg-white w-full md:w-fit md:right-0 z-30">
          {type == "range" ? (
            <div className="p-5">
              <h1 className="font-medium text-xs 2xl:text-sm  text-text ">
                Year Range
              </h1>
              <div className="mt-3 flex flex-col gap-3">
                <YearInput />
                <YearInput />
              </div>
              <div className="mt-5">
                <FilterButton />
              </div>
            </div>
          ) : (
            list && (
              <ul className="w-max overflow-y-auto h-max md:h-60">
                {list.map((item, index) => (
                  <li
                    key={index}
                    className="px-5 py-3 cursor-pointer hover:bg-accent/30 font-medium text-xs 2xl:text-sm"
                  >
                    {item}
                  </li>
                ))}
                <div className="m-3">
                  <FilterButton />
                </div>
              </ul>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
