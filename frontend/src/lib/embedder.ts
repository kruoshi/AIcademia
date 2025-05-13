// lib/embedder.ts
import { pipeline } from '@xenova/transformers';

// Cache the model pipeline so it's not loaded repeatedly
let embedder: any;

export async function encodeText(text: string): Promise<number[]> {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }

  const output = await embedder(text, {
    pooling: 'mean',
    normalize: true,
  });

  return Array.from(output.data); // Converts typed array to regular array
}
