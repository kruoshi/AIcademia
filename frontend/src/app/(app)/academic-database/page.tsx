import Card from "@/components/ui/SearchCard";
import CardRow from "@/components/ui/CardRow";
import Link from "next/link";

const AcademicDatabase = () => {
  return (
    <>
      <h1 className="font-arima font-bold text-xl xs:text-2xl sm:text-3xl xl:text-4xl">
        Explore <span className="text-secondary-dark">Academic Works</span>
      </h1>
      <div className="w-full">
        <p className="xl:font-bold font-medium font-roboto mt-5 text-sm md:text-base xl:text-lg">
          Recently Added
        </p>

        <div className="mt-3 overflow-x-auto pb-2 grid grid-flow-col auto-cols-[150px] xs:auto-cols-[180px] sm:auto-cols-[225px] xl:auto-cols-[250px]  gap-3 md:gap-4">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center xl:font-bold font-medium font-roboto mt-6 text-sm md:text-base xl:text-lg ">
          <p>Uploaded Papers</p>
          <Link
            href="/academic-database/view-all"
            className="text-[10px] md:text-xs xl:text-sm font-semibold text-text-dark"
          >
            View All
          </Link>
        </div>
        <div className="flex-1 mt-3 overflow-y-auto pb-2   ">
          <div className=" flex-col flex gap-0.5 ">
            <CardRow />
            <CardRow />
            <CardRow />
            <CardRow />
            <CardRow />
            <CardRow />
            <CardRow />
            <CardRow />
            <CardRow />
            <CardRow />
          </div>
        </div>
      </div>
    </>
  );
};

export default AcademicDatabase;
