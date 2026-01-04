import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";

// Create SQLite database (will be created in project root)
const sqlite = new Database("sqlite.db");

// Create Drizzle instance with schema
export const db = drizzle(sqlite, { schema });

// Re-export schema for convenience
export * from "./schema";
