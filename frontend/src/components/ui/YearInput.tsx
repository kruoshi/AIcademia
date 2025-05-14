import { Calendar } from "lucide-react";
const YearInput = () => {
  return (
    <div className="flex items-center rounded-md border border-accent">
      <div className="px-2 py-2 bg-zinc-200 rounded-l-md">
        <Calendar className="size-3 md:size-4" />
      </div>

      <input
        type="year"
        placeholder="Ending Year"
        id="start"
        className="pl-3 text-xs 2xl:text-sm font-medium focus:outline-none w-full md:w-max"
        autoComplete="none"
      />
    </div>
  );
};

export default YearInput;
