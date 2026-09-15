import { spawn } from "node:child_process";
import { config } from "../config/config.js";

export function runPython(payload) {
  return new Promise((resolve, reject) => {
    const process = spawn(config.python, ["main.py"], { cwd: config.ragRoot, stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    process.stdout.on("data", (part) => { stdout += part; });
    process.stderr.on("data", (part) => { stderr += part; });
    process.on("error", (error) => reject(new Error(`Could not start Python: ${error.message}`)));
    process.on("close", (code) => {
      if (code !== 0) return reject(new Error(stderr || `Python exited with code ${code}`));
      try {
        // Libraries may log during initialization; the protocol response is the final line.
        const response = JSON.parse(stdout.trim().split(/\r?\n/).at(-1));
        if (!response.ok) return reject(new Error(response.error));
        resolve(response.data);
      } catch { reject(new Error(stderr || "Python returned an invalid response.")); }
    });
    process.stdin.end(JSON.stringify(payload) + "\n");
  });
}
