import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";

// Create SQLite database (will be created in project root)
const sqlite = new Database("sqlite.db");

// Create Drizzle instance with schema
export const db = drizzle(sqlite, { schema });

// Run migrations
migrate(db, { migrationsFolder: "./server/database/migrations" });

// Re-export schema for convenience
export * from "./schema";
