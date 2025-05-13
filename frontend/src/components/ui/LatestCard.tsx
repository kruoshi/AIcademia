type CardProps = {
  id: string;
  title: string;
  specialization: string;
  course: string;
  date: string;
};

const LatestCard: React.FC<CardProps> = ({
  id,
  title,
  specialization,
  course,
  date,
}) => {
  return (
    <div
      key={id}
      className="bg-white rounded-sm shadow-md/5 py-2 sm:py-3 px-3 font-roboto cursor-pointer flex flex-col gap-2.5 justify-between text-center items-center h-full"
    >
      <h1 className="text-xs text-text sm:text-sm 3xl:text-base font-semibold pr-3 mt-2 line-clamp-4 sm:line-clamp-3 ">
        {title}
      </h1>
      <table className="font-roboto table-auto shadow-xs border-gray-300 w-full font-semibold text-[11px] sm:text-xs 3xl:text-sm">
        <tbody>
          <tr className="bg-gray-100 border-b border-gray-100 ">
            <td className="px-4 py-1 text-text">{course}</td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="px-4 py-1 text-text">{specialization}</td>
          </tr>
          <tr className="bg-gray-100 border-b border-gray-100">
            <td className="px-4 py-1 text-text">{date}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LatestCard;
