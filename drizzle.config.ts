import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config.ts";

export default defineConfig({
  schema: "src/lib/db",
  out: "src/lib/db/dist",
  dialect: "postgresql",
  dbCredentials: {
    url: readConfig().dbUrl,
  },
});
