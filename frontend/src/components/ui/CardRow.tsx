interface CardRowProps {
  title: string;
  specialization: string;
  course: string;
  date: string;
}

const CardRow: React.FC<CardRowProps> = ({
  title,
  specialization,
  course,
  date,
}) => {
  return (
    <div className="w-full bg-white px-3 py-2 shadow-md/5 rounded-sm flex flex-col gap-1.5 border border-grey">
      <h1 className="text-[10px] xs:text-xs md:text-sm font-semibold line-clamp-2">
        {title}
      </h1>
      <div className="flex justify-between items-center text-[9px] xs:text-[10px] md:text-xs font-semibold text-text-dark">
        <span>{course}</span>
        <span>{specialization}</span>
        <span>{date}</span>
      </div>
    </div>
  );
};

export default CardRow;
