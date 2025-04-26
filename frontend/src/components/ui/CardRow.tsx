const CardRow = () => {
  return (
    <div className="w-full bg-white px-3 py-2 shadow-md/5 rounded-sm flex flex-col gap-1.5 border border-grey">
      <h1 className="text-[10px] xs:text-xs md:text-sm font-semibold line-clamp-2">
        AquaFusion: Time-Dynamic Fish Feeding Mechanism with Real-time Water
        Quality Monitoring
      </h1>
      <div className="flex justify-between items-center text-[9px] xs:text-[10px] md:text-xs font-semibold text-text-dark">
        <span>Information Technology</span>
        <span>Automation</span>
        <span>Nov 2024</span>
      </div>
    </div>
  );
};

export default CardRow;
