import Card from "@/components/ui/Card";
const AcademicDatabase = () => {
  return (
    <div className="w-full">
      <h1 className="font-arima font-bold text-xl xs:text-2xl sm:text-3xl xl:text-4xl">
        Explore <span className="text-secondary-dark">Academic Works</span>
      </h1>
      <div>
        <p className="xl:font-bold font-medium font-roboto mt-6 text-sm xl:text-xl">
          Recently Added
        </p>
        <div className="mt-3 overflow-x-auto pb-2">
          <div className="grid grid-flow-col auto-cols-[270px] gap-4 ">
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
        </div>
      </div>
      <div>
        <p className="xl:font-bold font-medium font-roboto mt-6 text-sm xl:text-xl">
          Recently Added
        </p>
        <div className="mt-3 ">
          <div className="grid grid-cols-1 gap-4 ">
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicDatabase;
