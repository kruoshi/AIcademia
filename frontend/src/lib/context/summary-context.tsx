"use client";
import { createContext, useState, ReactNode, useContext } from "react";

type SummaryContextType = {
  summary: boolean;
  openSummary: () => void;
  closeSummary: () => void;
};

const SummaryContext = createContext<SummaryContextType | undefined>(undefined);

export const SummaryProvider = ({ children }: { children: ReactNode }) => {
  const [summary, setSummary] = useState(false);
  const openSummary = () => setSummary(true);
  const closeSummary = () => setSummary(false);

  return (
    <SummaryContext.Provider value={{ summary, openSummary, closeSummary }}>
      {children}
    </SummaryContext.Provider>
  );
};

export const useSummary = () => {
  const context = useContext(SummaryContext);
  if (!context)
    throw new Error("useSummary must be used within SidebarProvider");
  return context;
};
