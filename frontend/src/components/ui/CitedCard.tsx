type CardProps = {
  id: string;
  title: string;
  index: number;
};

const CitedCard: React.FC<CardProps> = ({ id, title, index }) => {
  return (
    <div
      key={id}
      className="cursor-pointer flex items-center bg-white shadow-xs/5 py-3 font-roboto font-medium h-15 xl:h-20"
    >
      <div className="font-roboto text-lg xl:text-xl font-semibold text-text px-8">
        {index}
      </div>
      <div>
        <h1 className="pr-5 text-xs xl:text-sm 3xl:text-base text-text font-medium line-clamp-2">
          {title}
        </h1>
      </div>
    </div>
  );
};
export default CitedCard;
