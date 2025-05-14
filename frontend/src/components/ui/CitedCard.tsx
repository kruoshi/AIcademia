type CardProps = {
  id: string;
  title: string;
  index: number;
};

const CitedCard: React.FC<CardProps> = ({ id, title, index }) => {
  return (
    <div
      key={id}
      className="cursor-pointer flex items-center font-roboto font-medium pt-1"
    >
      <div className="font-roboto text-base md:text-lg  xl:text-2xl border-b-3 border-secondary-dark font-semibold text-text px-1 mx-4 -mt-3">
        {index}
      </div>
      <div className="pb-4 flex-1 overflow-hidden border-b-3 mx-3  border-gray-100">
        <h1 className="px-2 text-xs md:text-sm 3xl:text-base text-text font-medium line-clamp-2 ">
          {title}
        </h1>
      </div>
    </div>
  );
};
export default CitedCard;
