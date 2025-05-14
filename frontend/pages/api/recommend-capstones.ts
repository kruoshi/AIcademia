import type { NextApiRequest, NextApiResponse } from 'next';
import { encodeText } from '@/lib/embedder';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const threshold = -0.5; // More lenient than search
  const { title, keywords, capstoneId } = req.body;

  if (!title || !keywords) {
    return res.status(400).json({ error: 'Missing title or keywords' });
  }

  const combined = `${title} ${keywords}`;
  const embedding = await encodeText(combined);

  const { data, error } = await supabase.rpc('vector_capstone_search', {
    embed: embedding
  });

  if (error) {
    return res.status(500).json({ error });
  }

  // Filter by threshold and optionally remove the current capstone itself
  const filtered = (data ?? []).filter(
    (item) => item.similarity_score >= threshold && item.id !== capstoneId
  );

  res.status(200).json(filtered);
}
