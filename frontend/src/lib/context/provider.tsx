"use client";
import { SidebarProvider } from "./sidebar-context";
import { SummaryProvider } from "./summary-context";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <SummaryProvider>{children}</SummaryProvider>
    </SidebarProvider>
  );
};

export default Provider;
