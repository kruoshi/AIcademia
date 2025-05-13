import { JSX } from "react";
import { Globe, Library, Stamp, BookCopy } from "lucide-react";

type NavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
};

const NavItems: NavItem[] = [
  {
    title: "Search Engine",
    path: "/search-engine",
    icon: <Globe strokeWidth={2.5} className="size-5 lg:size-5.5 3xl:size-6" />,
  },
  {
    title: "Publications",
    path: "/publications",
    icon: (
      <BookCopy strokeWidth={2.5} className="size-5 lg:size-5.5 3xl:size-6 " />
    ),
  },
  {
    title: "Library",
    path: "/collections",
    icon: (
      <Library strokeWidth={2.5} className="size-5 lg:size-5.5 3xl:size-6" />
    ),
  },

  {
    title: "For Approvals",
    path: "/for-approvals",
    icon: (
      <Stamp strokeWidth={2.5} className="size-5  lg:size-5.5 3xl:size-6" />
    ),
  },
];

export default NavItems;
