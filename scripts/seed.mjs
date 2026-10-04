// Copies the starter content in src/data into MongoDB.
// Usage: npm run seed              (adds anything missing, never overwrites edits)
//        npm run seed -- --force   (overwrites matching items with the starter content)
import { config } from "dotenv";
import mongoose from "mongoose";
import { importStarterContent } from "../src/lib/starter.js";

config({ path: ".env.local" });
config();

const uri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
if (!uri) {
  console.error("Set MONGODB_ATLAS_URI or MONGODB_URI first.");
  process.exit(1);
}

const overwrite = process.argv.includes("--force");
await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || undefined });
const added = await importStarterContent({ overwrite });
console.log(`${overwrite ? "Imported (overwriting)" : "Imported"}:`, added);
await mongoose.disconnect();
