"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@public/WHITELOGOTEXT_AICAD.svg";
import avatar from "@public/avatar.jpg";
import { CloudUpload, Ellipsis, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/lib/context/sidebar-context";
import NavItems from "@/lib/constants/NavItems";
import clsx from "clsx";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const { isOpen, closeSidebar } = useSidebar();
  const { data: session } = useSession();
  const user = session?.user;

  const toTitleCase = (name: string) =>
    name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 bg-black z-30 opacity-70 lg:hidden",
          isOpen ? "block" : "hidden",
        )}
        onClick={closeSidebar}
      >
      </div>

      <aside
        className={clsx(
          "fixed h-full z-40 bg-accent transition-all duration-300 ease-in-out",
          isOpen
            ? "top-0 left-0 w-3/5 xs:w-1/2 sm:w-1/3 lg:w-72 3xl:w-85"
            : "hidden",
        )}
      >
        <nav className="flex flex-col h-full w-full justify-between px-3 py-8 lg:px-6 font-roboto">
          <div className="flex flex-col">
            <Image
              src={logo}
              className="w-35 sm:w-40 lg:w-50 self-center"
              alt="Logo"
            />

            <div className="hidden relative items-center lg:flex gap-2 lg:gap-3.5 mt-14">
              <Image
                src={user?.image || avatar}
                className="lg:w-12 3xl:w-14 rounded-full border border-white"
                alt="Avatar"
                width={48}
                height={48}
              />
              <div className="flex flex-col font-medium text-white max-w-[140px]">
                <h1 className="text-base 3xl:text-lg truncate">
                  {user?.name ? toTitleCase(user.name) : "No Name"}
                </h1>
                <p className="text-sm 3xl:text-base text-text-light truncate">
                  {user?.email || "Student"}
                </p>
              </div>

              <div
                className="absolute rounded-s-full h-full right-0 -mr-6 px-4 bg-secondary flex items-center justify-center cursor-pointer"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <Ellipsis className="size-8" strokeWidth={2.5} color="black" />
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50">
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut className="size-4" strokeWidth={2} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Nav Items */}
            <ul className="font-sans flex flex-col gap-3 mt-12">
              {NavItems.map(({ title, path, icon }) => (
                <Link
                  key={title}
                  href={path}
                  className={clsx(
                    "flex items-center gap-4 sm:gap-6 py-3 px-3 rounded-s-full",
                    pathname.startsWith(path)
                      ? "text-black bg-secondary -mr-3 lg:-mr-6"
                      : "text-white hover:bg-white/10",
                  )}
                >
                  {icon}
                  <span className="font-bold text-sm lg:text-base 3xl:text-lg font-roboto">
                    {title}
                  </span>
                </Link>
              ))}
            </ul>
          </div>

          <Link
            href="/upload-project"
            className="text-black rounded-4xl bg-linear-to-tr mx-1 px-4 pb-6 pt-8 font-roboto from-accent to-secondary shadow-md/20 cursor-pointer"
          >
            <CloudUpload className="size-8 3xl:size-10" />
            <h1 className="text-base 3xl:text-lg font-bold mt-2">
              Upload Project
            </h1>
            <p className="text-xs 3xl:text-sm font-medium">
              Writing a chapter of your
              <br /> academic journey
            </p>
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
