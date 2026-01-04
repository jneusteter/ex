import { eq } from "drizzle-orm";
import { defineEventHandler, createError, readBody, H3Event } from "h3";
import { db } from "../../database";
import { exercises } from "../../database/schema";

export default defineEventHandler(async (event: H3Event) => {
  const id = Number(event.context.params?.id);
  const method = event.method;

  if (method === "GET") {
    const result = await db.select().from(exercises).where(eq(exercises.id, id));
    if (result.length === 0) {
      throw createError({ statusCode: 404, message: "Exercise not found" });
    }
    return result[0];
  }

  if (method === "PUT") {
    const body = await readBody(event);
    const result = await db.update(exercises)
      .set({
        name: body.name,
        muscleGroup: body.muscleGroup,
        equipment: body.equipment,
        notes: body.notes,
      })
      .where(eq(exercises.id, id))
      .returning();
    
    if (result.length === 0) {
      throw createError({ statusCode: 404, message: "Exercise not found" });
    }
    return result[0];
  }

  if (method === "DELETE") {
    await db.delete(exercises).where(eq(exercises.id, id));
    return { success: true };
  }
});
