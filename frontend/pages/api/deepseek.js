import { exec } from "child_process";
import path from "path";

export default function handler(req, res) {
  const scriptPath = path.join(process.cwd(), "scripts", "deepseek.py");

  exec(`python3 "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error("Script execution error:", stderr);
      return res.status(500).json({ error: stderr });
    }

    res.status(200).json({ output: stdout });
  });
}
