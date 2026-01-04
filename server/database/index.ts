import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as schema from "./schema";

// Create SQLite database (will be created in project root)
const sqlite = new Database("sqlite.db");

// Create Drizzle instance with schema
export const db = drizzle(sqlite, { schema });

// Run migrations
migrate(db, { migrationsFolder: "./server/database/migrations" });

// Re-export schema for convenience
export * from "./schema";
