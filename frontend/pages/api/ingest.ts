import type { NextApiRequest, NextApiResponse } from 'next';
import { encodeText } from '@/lib/embedder';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data: projects, error } = await supabase
      .from('capstones')
      .select('id, title, keywords, profile_id');

    if (error) throw error;
    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: 'No projects found' });
    }

    const results = [];

    for (const project of projects) {
      const compositeText = `${project.title}\n\nKeywords: ${project.keywords}`;
      const embedding = await encodeText(compositeText);

      const { error: upsertError } = await supabase
        .from('capstones')
        .upsert({
          id: project.id,
          title: project.title,
          keywords: project.keywords,
          embedding,
          profile_id: project.profile_id
        });

      if (upsertError) {
        console.error(`❌ Failed for project "${project.title}"`, upsertError);
      } else {
        console.log(`✅ Embedded: ${project.title}`);
        results.push(project.title);
      }
    }

    return res.status(200).json({ message: 'Embedding ingestion complete', count: results.length });
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: err.message });
  }
}
