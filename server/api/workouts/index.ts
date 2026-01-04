import { desc } from "drizzle-orm";
import { defineEventHandler, readBody, H3Event } from "h3";
import { db } from "../../database";
import { workouts } from "../../database/schema";

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method;

  if (method === "GET") {
    return db.select().from(workouts).orderBy(desc(workouts.startedAt));
  }

  if (method === "POST") {
    const body = await readBody(event);
    const result = await db.insert(workouts).values({
      name: body.name,
      notes: body.notes,
    }).returning();
    return result[0];
  }
});
