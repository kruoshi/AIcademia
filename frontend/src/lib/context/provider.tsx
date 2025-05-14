"use client";
import { SidebarProvider } from "./sidebar-context";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return <SidebarProvider>{children}</SidebarProvider>;
};

export default Provider;
