import { FilterProvider } from "@/lib/context/FIlterContext";
import Filter from "@/components/layout/filter";
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FilterProvider>
      <Filter />
      {children}
    </FilterProvider>
  );
}
