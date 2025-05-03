export default function AcademicDatabaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {children}
    </div>
  );
}
