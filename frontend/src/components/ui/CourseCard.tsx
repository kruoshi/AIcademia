import { FileText } from "lucide-react";

export type CourseCardProps = {
  course: string;
  total: number;
  specializations: {
    name: string;
    count: number;
  }[];
};

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  total,
  specializations,
}) => {
  return (
    <div className="border-s-6 border-secondary w-full xs:w-80 md:w-90 xl:w-100 snap-x shrink-0 rounded-sm shadow-sm py-2 px-4 sm:px-6 bg-white ">
      <header className="flex items-center justify-between">
        <div>
          <span className="font-black text-[11px] xs:text-xs xl:text-sm text-secondary-dark tracking-wide">
            OVERVIEW
          </span>
          <h1 className="font-black text-xs xs:text-sm md:text-base xl:text-lg uppercase">
            {course}
          </h1>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xl md:text-2xl xl:text-3xl font-black">
            {total}
          </span>
          <FileText className="size-5 md:size-6 xl:size-7" strokeWidth={2.5} />
        </div>
      </header>

      <div className="flex flex-nowrap overflow-x-auto items-center font-extrabold text-xs md:text-sm xl:text-base bg-text-light/10 w-full p-4 rounded-lg my-2 md:my-3 no-scrollbar">
        {specializations.map((s) => (
          <div className="text-center w-1/2 shrink-0" key={s.name}>
            <span className="text-text-dark">{s.count}</span>
            <h2 className="text-text">{s.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCard;
