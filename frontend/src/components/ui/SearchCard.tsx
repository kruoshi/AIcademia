import { Bookmark, GraduationCap, Workflow } from "lucide-react";

interface CardProps {
  id: string;
  title: string;
  specialization: string;
  course: string;
  date: string;
}

const SearchCard: React.FC<CardProps> = ({
  id,
  title,
  specialization,
  course,
  date,
}) => {
  return (
    <div
      key={id}
      className="break-inside-avoid border border-grey bg-white rounded-xl shadow-md/15 p-4  h-auto mb-4"
    >
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-1.5 text-text text-[10px] xs:text-[11px]  font-semibold">
          <span className="flex gap-1.5 items-center bg-accent/10 px-2.5 py-0.5 rounded-full ">
            <GraduationCap className="size-3.5 md:size-4.5" strokeWidth={1.5} />
            {course}
          </span>

          <span className="flex gap-1.5 items-center bg-accent/10 px-2.5 py-0.5 rounded-full ">
            <Workflow className="size-3.5 md:size-4.5" strokeWidth={1.5} />
            {specialization}
          </span>
        </div>
        <div className="border p-1.5 sm:p-2  rounded-full ">
          <Bookmark className="size-3 sm:size-3.5 md:size-4 " />
        </div>
      </div>
      <h1 className="my-4 md:my-5 text-text font-semibold text-xs xs:text-sm">
        {title}
      </h1>
      <div className="relative mb-2">
        <span className="absolute w-4 h-0.5 bg-text-dark top-1/2"></span>
        <p className="font-semibold text-[11px] xs:text-xs  text-text-dark ml-6 italic">
          {date}
        </p>
      </div>
    </div>
  );
};

export default SearchCard;
