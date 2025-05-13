'use client';

export default function IngestPage() {
  const handleIngest = async () => {
    const res = await fetch('/api/ingest');
    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin: Ingest Embeddings</h1>
      <button
        onClick={handleIngest}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Run Ingest Script
      </button>
    </main>
  );
}
