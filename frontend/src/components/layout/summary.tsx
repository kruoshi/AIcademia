"use client";
import clsx from "clsx";
import { useSummary } from "@/lib/context/summary-context";
import { X, GraduationCap, Bolt, Calendar } from "lucide-react";

const Summary: React.FC = () => {
  const { summary, closeSummary } = useSummary();
  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 bg-black opacity-70 z-40",
          summary ? "block" : "hidden"
        )}
        onClick={closeSummary}
      ></div>
      <aside
        className={clsx(
          "transition-all duration-300 ease-in-out z-50 bg-background sm:bg-white sm:right-5 sm:rounded-lg sm:top-1/2 sm:-translate-y-1/2 h-full sm:min-h-[95%] sm:max-h-[95%] w-full sm:w-100 lg:w-120 2xl:w-130 font-roboto p-6",
          summary ? "fixed flex flex-col" : "hidden"
        )}
      >
        <X
          className="block absolute top-4 right-4 text-text-dark size-7"
          strokeWidth={3}
          onClick={closeSummary}
        />
        <h1 className="font-arima font-bold mt-10 text-xl">
          Marilag: An Intelligent Cacao Bean Segregation System Based on
          Extracted Features and Image Recognition
        </h1>
        <h2 className="text-text-dark font-roboto font-semibold mt-2">
          J.B. Desiderio, L. R. Azores, R. M. Barnachea, L. U. Yang, R. C.
          Tayuan
        </h2>
        <ul className="font-roboto font-semibold flex flex-col gap-1 mt-3 text-text-dark text-sm">
          <li className="flex gap-5 items-center">
            <GraduationCap className="size-6" />
            <span>Information Technology</span>
          </li>
          <li className="flex gap-5 items-center">
            <Bolt />
            <span>Automation</span>
          </li>
          <li className="flex gap-5 items-center">
            <Calendar />
            <span>Nov 2026</span>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Summary;
