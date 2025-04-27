import { Search } from "lucide-react";
import SearchCard from "@/components/ui/SearchCard";
import Keywords from "@/components/ui/Keywords";

type DocInfo = {
  id: string;
  title: string;
  specialization: string;
  course: string;
  date: string;
};

const DocCard: DocInfo[] = [
  {
    id: "1",
    title:
      "AquaFusion: Time-Dynamic Fish Feeding Mechanism with Real-time Water Quality Monitoring",
    specialization: "Automation",
    course: "BS IT",
    date: "November 2023",
  },
  {
    id: "2",
    title:
      "Marilag: An Intelligent Cacao Bean Segregation System Based on Extracted Features and Image Recognition",
    specialization: "Automation",
    course: "BS IT",
    date: "November 2023",
  },
  {
    id: "5",
    title: "Capstone Automated Waste Segregator Version 3",
    specialization: "Automation",
    course: "BS IT",
    date: "November 2023",
  },
  {
    id: "3",
    title:
      "VISIONARY: Computer Vision-Enhanced Real-Time Illegal Parking Detection and Monitoring System",
    specialization: "Automation",
    course: "BS IT",
    date: "November 2023",
  },
  {
    id: "4",
    title:
      "Automated Heat Stress Monitoring and Management System for Poultry Farming",
    specialization: "Automation",
    course: "BS IT",
    date: "November 2023",
  },

  {
    id: "6",
    title:
      "RoboGuide: A Robot Assistant for Guiding Customers to their Desired Item in Retail Shops",
    specialization: "Automation",
    course: "BS IT",
    date: "November 2023",
  },
  {
    id: "7",
    title:
      "FishWatch: Automated Water Monitoring and Fish Kill Prediction System",
    specialization: "Automation",
    course: "BS IT",
    date: "November 2023",
  },
  {
    id: "8",
    title: "FRESHKO: Fruits and Vegetables Spoilage Detection System",
    specialization: "Automation",
    course: "BS IT",
    date: "November 2023",
  },
];

const SearchEngine = () => {
  return (
    <>
      <div className="text-center md:pt-10">
        <h1 className="font-arima font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl xl:text-5xl">
          Discover <span className="text-secondary-dark">Academic</span> works
          <br />
          done by the UST Community
        </h1>
        <p className="font-roboto text-text-dark font-medium text-[11px] xs:text-xs sm:text-sm md:text-base xl:text-lg lg:mt-2">
          Browse through various documented projects.{" "}
          <br className="xl:hidden" />
          <span className="text-secondary-dark font-semibold">
            Looking for related literatures?
          </span>
        </p>
        <div className="relative flex w-fit mt-5 sm:mt-8 mx-auto justify-center">
          <Search
            className="absolute left-2 top-1/2 -translate-y-1/2 text-text-dark size-3.5 sm:size-4 xl:size-5"
            strokeWidth={2.5}
          />
          <input
            type="text"
            name="search"
            placeholder="Search for related academic projects"
            className="placeholder:text-text-dark pl-8 pr-2 py-1 w-60 sm:w-100 ring-2 ring-secondary focus:outline-none rounded-md border-secondary-dark text-[10px] xs:text-[11px] sm:text-xs sm:pl-10 xl:pl-14 md:text-sm xl:text-base font-medium font-roboto auto-complete-none"
          />
        </div>
      </div>
      <div className="font-roboto flex flex-wrap items-center mx-auto sm:w-5/6 justify-center gap-2 mt-3 sm:mt-5 font-medium text-[10px] xs:text-[11px] sm:text-xs md:text-sm ">
        <Keywords />
        <Keywords />
        <Keywords />
        <Keywords />
        <Keywords />
        <Keywords />
      </div>

      <ul className=" mt-10 columns-1 sm:columns-2 xl:columns-3 sm:px-5 xl:px-10 2xl:px-20 gap-5 pb-5">
        {DocCard.map((doc) => (
          <li key={doc.id}>
            <SearchCard
              id={doc.id}
              title={doc.title}
              specialization={doc.specialization}
              course={doc.course}
              date={doc.date}
            />
          </li>
        ))}
      </ul>
      <button className="mt-10 mx-auto block text-center text-lg px-8 py-1.5 rounded-full font-semibold bg-secondary-dark">
        Show More
      </button>
    </>
  );
};

export default SearchEngine;
