import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const ViewAll = () => {
  return (
    <>
      <div className="font-arima font-bold text-xl xs:text-2xl sm:text-3xl xl:text-4xl flex gap-3 items-center ">
        <Link href="/publications">
          <ChevronLeft className="size-10" />
        </Link>
        <h1>
          Uploaded <span className="text-secondary-dark">Papers</span>
        </h1>
      </div>
    </>
  );
};

export default ViewAll;
