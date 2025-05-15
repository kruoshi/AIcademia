import { GraduationCap, Calendar } from "lucide-react";
type CardProps = {
  id: string;
  title: string;
  specialization: string;
  course: string;
  date: string;
  onClick?: () => void;
};

const LatestCard: React.FC<CardProps> = ({
  id,
  title,
  specialization,
  course,
  date,
  onClick,
}) => {
  return (
    <div
      key={id}
      className="bg-white rounded-sm shadow-md/5 p-3 lg:p-5 font-roboto cursor-pointer flex flex-col justify-between h-full border-t-5 border-secondary-dark"
      onClick={onClick}
    >
      <div>
        <span className="text-text-dark font-semibold text-[10px] sm:text-[11px] md:text-xs xl:text-sm line-clamp-1">
          {specialization?.toUpperCase()}
        </span>
        <h1 className="text-[11px] font-medium sm:text-xs md:text-sm xl:text-base mt-2 line-clamp-4">
          {title}
        </h1>
      </div>

      <div className="border-t pt-2 border-text-dark/40 flex justify-between items-center text-[10px] sm:text-[11px] md:text-sm font-semibold text-text-dark ">
        <div className="flex gap-1.5 items-center ">
          <GraduationCap className="size-4 md:size-5 " strokeWidth={2.5} />
          <span>
            BS{" "}
            {course?
              .split(" ")
              .map((word) => word[0].toUpperCase())
              .join("")}
          </span>
        </div>
        <div className="flex gap-1.5 items-center ">
          <span>{date}</span>
          <Calendar className="size-3 md:size-4 " strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

export default LatestCard;
