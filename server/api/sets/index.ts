import { eq, and, max } from "drizzle-orm";
import { db } from "../../database";
import { workoutSets } from "../../database/schema";

export default defineEventHandler(async (event) => {
  const method = event.method;

  if (method === "POST") {
    const body = await readBody(event);
    
    // Get the max set number for this exercise in this workout
    const maxSetResult = await db
      .select({ maxSet: max(workoutSets.setNumber) })
      .from(workoutSets)
      .where(
        and(
          eq(workoutSets.workoutId, body.workoutId),
          eq(workoutSets.exerciseId, body.exerciseId)
        )
      );
    
    const nextSetNumber = (maxSetResult[0]?.maxSet ?? 0) + 1;

    const result = await db.insert(workoutSets).values({
      workoutId: body.workoutId,
      exerciseId: body.exerciseId,
      setNumber: nextSetNumber,
      weight: body.weight,
      reps: body.reps,
      rpe: body.rpe,
      notes: body.notes,
    }).returning();
    
    return result[0];
  }
});
