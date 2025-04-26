import { GraduationCap, Calendar } from "lucide-react";

/* interface CardProps {
  title: string;
  specialization: string;
  course: string;
  year: string;
  id: string;
} */

const Card: React.FC = () => {
  return (
    <div className="flex flex-col justify-between border-t-3  border-secondary-darker bg-white h-40 md:h-50  rounded-md shadow-md/10 px-4 py-3 ">
      <div className="flex flex-col gap-2">
        <span className="text-text-dark font-semibold text-[10px] sm:text-[11px] md:text-xs ">
          IT Automation
        </span>
        <h1 className="text-[11px] font-medium sm:text-xs xl:text-sm line-clamp-3 ">
          AquaFusion: Time-Dynamic Fish Feeding Mechanism with Real-time Water
          Quality Monitoring
        </h1>
      </div>

      <div className="border-t pt-2 border-text-dark/40 flex justify-between items-center text-[10px] sm:text-[11px] md:text-xs font-semibold text-text-dark ">
        <div className="flex gap-1.5 items-center ">
          <GraduationCap className="size-4 md:size-5 " />
          <span>BS IT</span>
        </div>
        <div className="flex gap-1.5 items-center">
          <Calendar className="size-3 md:size-4 " strokeWidth={2.5} />
          <span>Nov 2024</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
