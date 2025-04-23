"use client";
import { SidebarProvider } from "./sidebar-context";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <SidebarProvider>{children}</SidebarProvider>;
};

export default Providers;
