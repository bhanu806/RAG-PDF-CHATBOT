import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
export const config = {
  port: Number(process.env.PORT || 5000),
  apiKey: process.env.GOOGLE_API_KEY,
  python: process.env.PYTHON_COMMAND || "python",
  serverRoot: path.resolve(directory, ".."),
  ragRoot: path.resolve(directory, "../../rag")
};
