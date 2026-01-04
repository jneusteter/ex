import { defineEventHandler, readBody, H3Event } from "h3";
import { db } from "../../database";
import { exercises } from "../../database/schema";

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method;

  if (method === "GET") {
    return db.select().from(exercises).orderBy(exercises.name);
  }

  if (method === "POST") {
    const body = await readBody(event);
    const result = await db.insert(exercises).values({
      name: body.name,
      muscleGroup: body.muscleGroup,
      equipment: body.equipment,
      notes: body.notes,
    }).returning();
    return result[0];
  }
});
