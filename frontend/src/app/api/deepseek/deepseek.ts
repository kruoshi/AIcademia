import { exec } from 'child_process';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  exec('python3 path/to/deepseek.py', (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: stderr });
    } else {
      res.status(200).json({ output: stdout });
    }
  });
}
