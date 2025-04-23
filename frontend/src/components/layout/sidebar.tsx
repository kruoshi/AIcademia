"use client";
import { JSX } from "react";
import { Globe, BookOpen, Library, FileUp, Stamp, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@public/WHITELOGOTEXT_AICAD.svg";
import avatar from "@public/avatar.jpg";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/lib/context/sidebar-context";
import clsx from "clsx";

type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
};

const sideNavItems: SideNavItem[] = [
  {
    title: "Search Engine",
    path: "/search-engine",
    icon: <Globe strokeWidth={2.5} className="size-4 md:size-5" />,
  },
  {
    title: "Reading References",
    path: "/reading-references",
    icon: <BookOpen strokeWidth={2.5} className="size-4 md:size-5 " />,
  },
  {
    title: "Academic Database",
    path: "/academic-database",
    icon: <Library strokeWidth={2.5} className="size-4 md:size-5" />,
  },
  {
    title: "Upload Project",
    path: "/upload-project",
    icon: <FileUp strokeWidth={2.5} className="size-4 md:size-5 " />,
  },
  {
    title: "Review Approvals",
    path: "/review-approvals",
    icon: <Stamp strokeWidth={2.5} className="size-4 md:size-5" />,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { isOpen, closeSidebar } = useSidebar();
  return (
    <>
      <div
        className={clsx(
          "fixed size-screen inset-0 bg-black z-30 opacity-70 lg:hidden",
          isOpen ? "block" : "hidden"
        )}
        onClick={closeSidebar}
      ></div>
      <aside
        className={clsx(
          "fixed h-full z-40 bg-accent transition-all duration-300 ease-in-out ",
          isOpen ? "top-0 left-0 w-3/5 xs:w-1/2 sm:w-1/3 lg:w-72 " : "hidden"
        )}
      >
        <nav className="flex flex-col h-full pt-2 justify-between">
          <div className="flex flex-col gap-8 lg:gap-10">
            <Image
              src={logo}
              className="w-25 ml-5 lg:w-40 lg:ml-0 lg:self-center lg:mt-3"
              alt="Logo"
            ></Image>
            <ul className="font-sans flex flex-col gap-2.5 mx-3 ">
              {sideNavItems.map(({ title, path, icon }) => (
                <Link
                  key={title}
                  href={path}
                  className={clsx(
                    "flex items-center gap-3 sm:gap-5 py-2 px-3 md:px-5 rounded-md ",
                    pathname === path
                      ? "text-black bg-secondary "
                      : "text-white hover:bg-white/10"
                  )}
                >
                  {icon}
                  <span className="text-[11px] xs:text-xs font-bold lg:text-sm font-roboto">
                    {title}
                  </span>
                </Link>
              ))}
            </ul>
          </div>
          <footer className="flex gap-2 p-3 border-t-2 border-white items-center justify-between text-white w-full">
            <div className="flex gap-3 w-6/7">
              <Image
                src={avatar}
                className="w-6 xs:w-8 lg:w-10 rounded-full border border-white"
                alt="Avatar"
              />
              <div className="flex flex-col font-medium truncate">
                <h1 className="text-[10px] truncate xs:text-sm lg:text-[14px]">
                  Jose Danrick Desiderio
                </h1>
                <p className="text-[8px] truncate xs:text-[10px] lg:text-[11px]">
                  josedanrick.desiderio.cics@ust.edu.ph
                </p>
              </div>
            </div>

            <LogOut className="w-4 xs:w-5 lg:w-6" strokeWidth={3} />
          </footer>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
