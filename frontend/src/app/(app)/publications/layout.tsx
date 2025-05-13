export default function AcademicDatabaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col overflow-hidden">{children}</div>;
}
