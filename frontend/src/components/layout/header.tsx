"use client";
import { Menu } from "lucide-react";
import { useSidebar } from "@/lib/context/sidebar-context";
import logo from "@public/WHITELOGOTEXT_AICAD.svg";
import Image from "next/image";

const Header = () => {
  const { openSidebar } = useSidebar();

  return (
    <header className="sticky lg:hidden inset-x-0 top-0 z-20 px-5 py-2 w-screen transition-all border-b border-gray-200 bg-accent flex justify-between items-center drop-shadow-lg">
      <Image src={logo} className="w-25" alt="Logo"></Image>
      <Menu className="size-6" color="white" onClick={openSidebar} />
    </header>
  );
};

export default Header;
