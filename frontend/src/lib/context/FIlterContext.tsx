"use client";
import { createContext, useState, ReactNode, useContext } from "react";

type FilterContextType = {
  filter: boolean;
  layout: string;
  openFilter: (layout: string) => void;
  closeFilter: () => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilter] = useState(false);
  const [layout, setLayout] = useState<string>("");
  const openFilter = (layout: string) => {
    setFilter(true);
    setLayout(layout);
  };
  const closeFilter = () => setFilter(false);

  return (
    <FilterContext.Provider value={{ filter, layout, openFilter, closeFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useFilter must be used within FilterProvider");
  return context;
};
