import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createApp } from "./app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const port = Number(process.env.PORT ?? "4000");
const app = createApp();

app.listen(port, () => {
  console.log(`[fbs-backend] API listening on http://localhost:${port}`);
});
