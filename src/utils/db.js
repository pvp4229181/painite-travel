import mongoose from "mongoose";

const uri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;

// Reuse one connection across hot reloads and serverless invocations.
let cached = globalThis.__painiteMongoose;
if (!cached) cached = globalThis.__painiteMongoose = { conn: null, promise: null };

export function isDbConfigured() {
  return Boolean(uri);
}

export default async function connectDB() {
  if (!uri) throw new Error("MongoDB is not configured. Set MONGODB_ATLAS_URI or MONGODB_URI.");
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
        dbName: process.env.MONGODB_DB || undefined,
      })
      .then((m) => m)
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
