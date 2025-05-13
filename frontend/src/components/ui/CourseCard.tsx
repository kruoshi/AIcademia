import { FileText } from "lucide-react";
const CourseCard = () => {
  return (
    <div className="border-s-6 border-secondary w-full xs:w-80 md:w-90 xl:w-100 snap-x snap-mandatory shrink-0 rounded-sm shadow-sm py-2 px-4 sm:px-6 bg-white ">
      <header className="flex items-center justify-between">
        <div>
          <span className="font-black text-[11px] xs:text-xs xl:text-sm text-secondary-dark tracking-wide">
            OVERVIEW
          </span>
          <h1 className="font-black text-xs xs:text-sm md:text-base xl:text-lg">
            COMPUTER SCIENCE
          </h1>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xl md:text-2xl xl:text-3xl font-black">60</span>
          <FileText className="size-5 md:size-6 xl:size-7" strokeWidth={2.5} />
        </div>
      </header>
      <div className="flex flex-nowrap gap-0.5 snap-x snap-mandatory overflow-x-auto items-center font-extrabold text-xs md:text-sm xl:text-base bg-text-light/10 w-full p-4 rounded-lg my-2 md:my-3 no-scrollbar">
        <div className="text-center w-1/2 shrink-0">
          <span className="text-text-dark">25 </span>
          <h2 className="text-text">Data Science</h2>
        </div>
        <div className="text-center shrink-0 w-1/2">
          <span className="text-text-dark">25 </span>
          <h2 className="text-text">Data Science</h2>
        </div>
        <div className="text-center shrink-0 w-1/2">
          <span className="text-text-dark">25 </span>
          <h2 className="text-text">Data Science</h2>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
