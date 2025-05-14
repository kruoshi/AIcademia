"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const items: number[] = [10, 20, 30, 40, 50];
const ItemsPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="border border-zinc-200 rounded-lg inline-flex gap-2 px-2 py-1 items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-[11px] xs:text-xs sm:text-sm 2xl:text-base text-text">
          10
        </span>
        {isOpen ? (
          <ChevronUp className="size-3 " strokeWidth={2} />
        ) : (
          <ChevronDown className="size-3 " strokeWidth={2} />
        )}
      </button>
      {isOpen && (
        <div className="absolute mt-2.5 border border-zinc-200 rounded-sm bg-white w-full text-center z-30">
          <ul>
            {items.map((item, index) => (
              <li
                key={index}
                className="p-1.5 text-[11px] xs:text-xs md:text-sm hover:bg-zinc-200"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ItemsPage;
