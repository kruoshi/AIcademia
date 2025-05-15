'use client';

import { useEffect, useState } from 'react';

export default function IngestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIngest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ingest');
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Run on component mount
  useEffect(() => {
    handleIngest();
  }, []); // Empty dependency array means run once on mount

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin: Ingest Embeddings</h1>
      
      <button
        onClick={handleIngest}
        disabled={isLoading}
        className={`bg-green-600 text-white px-4 py-2 rounded ${
          isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
        }`}
      >
        {isLoading ? 'Processing...' : 'Run Ingest Script'}
      </button>

      {isLoading && (
        <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded">
          Updating embeddings, please wait...
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-800 rounded">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h2 className="font-bold mb-2">Result:</h2>
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}