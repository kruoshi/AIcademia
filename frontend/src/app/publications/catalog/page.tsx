import FilterBtn from "@/components/ui/FilterBtn";
import MobileData from "@/components/ui/MobileData";
import {
  Search,
  FileText,
  Calendar,
  MoveLeft,
  MoveRight,
  ChevronLeft,
} from "lucide-react";
import Dropdown from "@/components/ui/Dropdown";
import ItemsPage from "@/components/ui/ItemsPage";
import TableRow from "@/components/ui/TableRow";
import Link from "next/link";

type DataProps = {
  title: string;
  rn: string;
  document: string;
  date: string;
};

/* Document Type based on Department */
const documentList: string[] = [
  "Joint Issuances",
  "Implementing Rules and Regulations",
  "General Memorandum Orders",
  "General Memorandum Circulars",
  "General Circulars",
  "Citizen's Charters",
  "General Administrative Orders",
  "Circulars",
  "Circular Orders",
  "Brochures and Manuals",
  "Administrative Orders",
];

/*Number of Documents from Database*/
const agencyDocs: Record<string, number> = {
  IT: 42,
  CS: 21,
  IS: 50,
};

/* Sample Retrieve of Documents from Database */
const data: DataProps[] = [
  {
    title:
      "Revised Omnibus Guidelines Governing the Awards and Administration of Renewable Energy Contracts",
    rn: "DC2024-06-0018",
    document: "Department Circulars",
    date: "06/04/24",
  },
  {
    title:
      "Revised Omnibus Guidelines Governing the Awards and Administration of Renewable Energy Contracts",
    rn: "DC2024-06-0018",
    document: "Department Circulars",
    date: "06/04/24",
  },
  {
    title:
      "Revised Omnibus Guidelines Governing the Awards and Administration of Renewable Energy Contracts",
    rn: "DC2024-06-0018",
    document: "Department Circulars",
    date: "06/04/24",
  },
  {
    title:
      "Revised Omnibus Guidelines Governing the Awards and Administration of Renewable Energy Contracts",
    rn: "DC2024-06-0018",
    document: "Department Circulars",
    date: "06/04/24",
  },
  {
    title:
      "Revised Omnibus Guidelines Governing the Awards and Administration of Renewable Energy Contracts",
    rn: "DC2024-06-0018",
    document: "Department Circulars",
    date: "06/04/24",
  },
  {
    title:
      "Revised Omnibus Guidelines Governing the Awards and Administration of Renewable Energy Contracts",
    rn: "DC2024-06-0018",
    document: "Department Circulars",
    date: "06/04/24",
  },
  {
    title:
      "Revised Omnibus Guidelines Governing the Awards and Administration of Renewable Energy Contracts",
    rn: "DC2024-06-0018",
    document: "Department Circulars",
    date: "06/04/24",
  },
  {
    title:
      "Revised Omnibus Guidelines Governing the Awards and Administration of Renewable Energy Contracts",
    rn: "DC2024-06-0018",
    document: "Department Circulars",
    date: "06/04/24",
  },
  {
    title:
      "Revised Omnibus Guidelines Governing the Awards and Administration of Renewable Energy Contracts",
    rn: "DC2024-06-0018",
    document: "Department Circulars",
    date: "06/04/24",
  },
  {
    title:
      "Revised Omnibus Guidelines Governing the Awards and Administration of Renewable Energy Contracts",
    rn: "DC2024-06-0018",
    document: "Department Circulars",
    date: "06/04/24",
  },
];

const Catalog: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="font-arima font-bold text-xl xs:text-2xl sm:text-3xl xl:text-4xl flex gap-3 items-center ">
        <Link href="/publications">
          <ChevronLeft className="size-10" />
        </Link>
        <h1>
          Uploaded <span className="text-secondary-dark">Papers</span>
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-1 md:gap-3 w-full mt-3 sm:mt-6 md:mt-8 sm:rounded-md sm:bg-secondary sm:p-5 sm:items-center">
        <div className="relative flex flex-1">
          <Search
            className="absolute right-5 top-1/2 -translate-y-1/2 size-4  2xl:size-5 text-accent"
            strokeWidth={2.5}
          />
          <input
            type="text"
            name="search"
            placeholder="Search for document"
            className="px-5 py-2 w-full border bg-white border-zinc-200 shadow-md/5 focus:outline-none rounded-md text-xs lg:text-sm 2xl:text-base font-medium font-ibm "
            autoComplete="none"
          />
        </div>
        <div className="hidden md:flex gap-3">
          <Dropdown
            type="list"
            icon={<FileText className="size-5" />}
            name="Document"
            list={documentList}
          />
          <Dropdown
            type="range"
            icon={<Calendar className="size-5" />}
            name="Year"
          />
        </div>
        <div className="flex md:hidden gap-1 w-full sm:w-fit ">
          <FilterBtn type="Filter" />
          <FilterBtn type="Sort" />
        </div>
      </div>

      <div className="relative flex-1 sm:min-h-0  flex-col mt-5 flex w-full ">
        <div className="py-2 sm:py-5 flex justify-start max-w-full lg:max-w-fit items-center overflow-x-auto border-accent no-scrollbar scroll-smooth scroll-ps-5 snap-x snap-proximity">
          {Object.entries(agencyDocs).map(([agency, value]) => (
            <div
              key={agency}
              className="font-roboto relative cursor-pointer flex gap-2 px-8 sm:px-10 group justify-center items-center snap-center"
            >
              <h1 className="font-extrabold text-sm xs:text-base sm:text-lg 2xl:text-xl text-accent">
                {agency}
              </h1>
              <span className="text-xs xs:text-sm sm:text-base 2xl:text-lg font-semibold bg-secondary px-1 sm:px-2 text-text rounded-sm ">
                {value}
              </span>
              <span className="absolute w-full h-0.5 sm:h-1 -bottom-2 sm:-bottom-5 group-hover:bg-secondary z-20 rounded-full"></span>
            </div>
          ))}
          <span className="absolute w-full h-0.5 sm:h-1 top-8.5 xs:top-9.5 sm:top-16  bg-accent rounded-full "></span>
        </div>
        <div className="flex bg-white justify-between shadow-md/5 px-5 py-2 sm:py-3 text-[11px] xs:text-xs sm:text-sm 2xl:text-base font-medium text-accent w-auto items-center">
          <span>1 - 10 of 88 results</span>
          <div className="inline-flex gap-2 items-center">
            <span>Items per page</span>
            <ItemsPage />
          </div>
        </div>
        <div className="flex flex-1 flex-col sm:hidden gap-2 max-h-full mt-2 ">
          {data.map((item, index) => (
            <MobileData
              key={index}
              title={item.title}
              rn={item.rn}
              document={item.document}
              date={item.date}
            />
          ))}
        </div>

        <div className="hidden sm:block flex-1 relative scroll-smooth no-scrollbar bg-white overflow-hidden min-h-0 overflow-y-auto">
          <table className="w-full h-full  text-left text-text">
            <thead className="text-white text-sm 2xl:text-base  bg-accent sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3 ">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Specialization
                </th>
                <th scope="col" className="px-6 py-3 lg:w-1/2">
                  <div className="flex items-center">
                    Capstone
                    <a href="#">
                      <svg
                        className="w-3 h-3 ms-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </div>
                </th>
                <th scope="col" className="px-6 py-2 ">
                  <div className="flex items-center">
                    Date
                    <a href="#">
                      <svg
                        className="w-3 h-3 ms-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className=" text-sm 2xl:text-base font-semibold align-text-top ">
              {data.map((item, index) => (
                <TableRow
                  key={index}
                  title={item.title}
                  rn={item.rn}
                  document={item.document}
                  date={item.date}
                />
              ))}
            </tbody>
          </table>
        </div>
        <nav
          className="flex items-center flex-row justify-between mt-2 sm:mt-0 bg-white shadow-md/5 px-3 py-2 sm:py-3 text-[11px] xs:text-xs sm:text-sm 2xl:text-base font-medium text-text w-auto "
          aria-label="Table navigation"
        >
          <button className="flex gap-1 items-center bg-zinc-200 px-3 py-1 rounded-sm">
            <MoveLeft className="size-3" />
            <span>Previous</span>
          </button>
          <ul className="inline-flex text-accent font-medium">
            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 py-1 h-full "
              >
                2
              </a>
            </li>
            <li>
              <a
                href="#"
                aria-current="page"
                className="flex items-center justify-center px-3 py-1 h-full bg-primary text-white font-bold "
              >
                3
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 py-1 h-full "
              >
                4
              </a>
            </li>
          </ul>
          <button className="flex gap-1 items-center bg-zinc-200 px-3 py-1 rounded-sm">
            <span>Next</span>
            <MoveRight className="size-3" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Catalog;
