import type { NextApiRequest, NextApiResponse } from 'next';
import { encodeText } from '@/lib/embedder';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const threshold = -0.35;
  const { query } = req.body;

  if (!query) return res.status(400).json({ error: 'Missing query' });

  const embedding = await encodeText(query);

  const { data, error } = await supabase.rpc('vector_capstone_search', {
    embed: embedding
  });

  if (error) return res.status(500).json({ error });
  
  const filtered = (data ?? []).filter((item) => item.similarity_score >= threshold);

  res.status(200).json(filtered);
}
