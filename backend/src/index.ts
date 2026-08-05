import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createApp } from "./app.js";
import { getAuthDatabase, initializeAuthDatabase } from "./lib/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const port = Number(process.env.PORT ?? "4000");
const app = createApp();

app.listen(port, () => {
  console.log(`[fbs-backend] API listening on http://localhost:${port}`);
  // Pre-warm MySQL pool + schema so the first dashboard request isn't cold (~2s+)
  void (async () => {
    try {
      const t0 = Date.now();
      getAuthDatabase();
      await initializeAuthDatabase();
      await getAuthDatabase().query("SELECT 1");
      console.log(`[auth-db] Pool warm-up complete in ${Date.now() - t0}ms`);
    } catch (err) {
      console.error("[auth-db] Pool warm-up failed:", err);
    }
  })();
});
