"use client";
import { FileText } from "lucide-react";

type DataProps = {
  title: string;
  rn: string;
  document: string;
  date: string;
};

const MobileData: React.FC<DataProps> = ({ title, rn, document, date }) => {
  return (
    <div className="flex flex-col gap-4 bg-white cursor-pointer p-3 border border-zinc-200 ">
      <div className="flex gap-2 font-semibold text-xs xs:text-sm sm:text-base items-start ">
        <FileText
          className="size-3 mt-0.5 xs:mt-1 xs:size-4 sm:size-5"
          strokeWidth={2.5}
        />
        <h1 className="text-text flex-1 mr-5 ">{title}</h1>
      </div>
      <table className="table-auto shadow-xs border-gray-300 w-full font-semibold text-[10px] xs:text-xs sm:text-sm">
        <tbody>
          <tr className="bg-gray-50 border-b border-gray-100 ">
            <td className="px-4 py-2 text-left text-text-dark">
              Reference Number
            </td>
            <td className="px-4 py-2 text-right text-text"># {rn}</td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="px-4 py-2 text-left text-text-dark">Content Type</td>
            <td className="px-4 py-2 text-right text-text">{document}</td>
          </tr>
          <tr className="bg-gray-50 border-b border-gray-100">
            <td className="px-4 py-2 text-left text-text-dark">
              Published Date
            </td>
            <td className="px-4 py-2 text-right text-text">{date}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MobileData;
