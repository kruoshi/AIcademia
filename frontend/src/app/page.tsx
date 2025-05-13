'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const search = async () => {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setResults(data);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Capstone Search</h1>
      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="Search projects..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={search} className="bg-blue-600 text-white px-4 py-2 rounded">
        Search
      </button>

      <ul className="mt-6 space-y-4">
        {results.map((result, i) => (
          <li key={i} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{result.title}</h2>
            <p className="text-xs text-gray-500">Score: {result.similarity_score?.toFixed(3)}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
