"use client";

type DataProps = {
  title: string;
  rn: string;
  document: string;
  date: string;
};

const TableRow: React.FC<DataProps> = ({ title, rn, document, date }) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer">
      <td className="px-6 py-4">{rn}</td>
      <td className="px-6 py-4">{document}</td>
      <td className="px-6 py-4">{title}</td>
      <td className="px-6 py-4">{date}</td>
    </tr>
  );
};

export default TableRow;
