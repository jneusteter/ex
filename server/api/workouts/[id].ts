import { eq, asc } from "drizzle-orm";
import { defineEventHandler, createError, readBody, H3Event } from "h3";
import { db } from "../../database";
import { workouts, workoutSets, exercises } from "../../database/schema";

export default defineEventHandler(async (event: H3Event) => {
  const id = Number(event.context.params?.id);
  const method = event.method;

  if (method === "GET") {
    const workout = await db.select().from(workouts).where(eq(workouts.id, id));
    if (workout.length === 0) {
      throw createError({ statusCode: 404, message: "Workout not found" });
    }

    // Get all sets for this workout with exercise details
    const sets = await db
      .select({
        id: workoutSets.id,
        setNumber: workoutSets.setNumber,
        weight: workoutSets.weight,
        reps: workoutSets.reps,
        rpe: workoutSets.rpe,
        notes: workoutSets.notes,
        completedAt: workoutSets.completedAt,
        exerciseId: workoutSets.exerciseId,
        exerciseName: exercises.name,
        muscleGroup: exercises.muscleGroup,
      })
      .from(workoutSets)
      .innerJoin(exercises, eq(workoutSets.exerciseId, exercises.id))
      .where(eq(workoutSets.workoutId, id))
      .orderBy(asc(workoutSets.completedAt), asc(workoutSets.setNumber));

    return {
      ...workout[0],
      sets,
    };
  }

  if (method === "PUT") {
    const body = await readBody(event);
    const result = await db.update(workouts)
      .set({
        name: body.name,
        notes: body.notes,
        completedAt: body.completed ? new Date() : null,
      })
      .where(eq(workouts.id, id))
      .returning();
    
    if (result.length === 0) {
      throw createError({ statusCode: 404, message: "Workout not found" });
    }
    return result[0];
  }

  if (method === "DELETE") {
    // Sets will be cascade deleted due to foreign key
    await db.delete(workouts).where(eq(workouts.id, id));
    return { success: true };
  }
});
