export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
      <main className="min-h-screen w-screen bg-white text-black">
        {children}
      </main>
    );
  }