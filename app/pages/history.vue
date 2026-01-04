<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white">Workout History</h1>
      <p class="text-dark-400 mt-1">Review your past training sessions</p>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <div class="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!completedWorkouts.length" class="text-center py-16">
      <IconChart class="w-16 h-16 text-dark-600 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-dark-300 mb-2">No workout history</h3>
      <p class="text-dark-500 mb-4">Complete your first workout to see it here</p>
      <JButton to="/workout">
        <IconDumbbell class="w-5 h-5 mr-2" />
        Start Workout
      </JButton>
    </div>

    <!-- Workout List -->
    <div v-else class="space-y-4">
      <div
        v-for="workout in completedWorkouts"
        :key="workout.id"
        class="card"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-white">
              {{ workout.name || 'Workout' }}
            </h3>
            <p class="text-dark-400 text-sm">
              {{ formatDate(workout.startedAt) }}
              <span v-if="workout.completedAt" class="text-dark-500">
                 &middot; {{ formatDuration(workout.startedAt, workout.completedAt) }}
              </span>
            </p>
          </div>
          <JButton
            variant="ghost"
            @click="deleteWorkout(workout.id)"
            class="p-2 text-dark-500 hover:text-red-400"
          >
            <IconTrash class="w-4 h-4" />
          </JButton>
        </div>

        <!-- Workout Details (expandable) -->
        <button
          @click="toggleExpand(workout.id)"
          class="w-full text-left"
        >
          <div class="flex items-center justify-between py-2 text-dark-400 text-sm">
            <span>View details</span>
            <svg
              class="w-5 h-5 transition-transform"
              :class="{ 'rotate-180': expandedWorkouts.includes(workout.id) }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <!-- Expanded Details -->
        <div
          v-if="expandedWorkouts.includes(workout.id)"
          class="mt-4 pt-4 border-t border-dark-700"
        >
          <div v-if="workoutDetails[workout.id]" class="space-y-4">
            <div
              v-for="(group, exerciseName) in groupSetsByExercise(workoutDetails[workout.id]?.sets ?? [])"
              :key="exerciseName"
              class="bg-dark-700/50 rounded-lg p-4"
            >
              <h4 class="font-medium text-white mb-3">{{ exerciseName }}</h4>
              <div class="grid grid-cols-4 gap-2 text-sm">
                <div class="text-dark-500">Set</div>
                <div class="text-dark-500">Weight</div>
                <div class="text-dark-500">Reps</div>
                <div class="text-dark-500">RPE</div>
                <template v-for="set in group" :key="set.id">
                  <div class="text-dark-300">{{ set.setNumber }}</div>
                  <div class="text-white">{{ set.weight ?? '-' }}</div>
                  <div class="text-white">{{ set.reps ?? '-' }}</div>
                  <div class="text-white">{{ set.rpe ?? '-' }}</div>
                </template>
              </div>
            </div>
            <div v-if="!(workoutDetails[workout.id]?.sets?.length)" class="text-dark-500 text-center py-4">
              No exercises logged
            </div>
          </div>
          <div v-else class="flex justify-center py-4">
            <div class="w-5 h-5 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useFetch } from "#imports";
import { $fetch } from "ofetch";
import type { Workout, WorkoutWithSets, WorkoutSetWithExercise } from "~/types/database";
import IconChart from "~/components/icons/IconChart.vue";
import IconDumbbell from "~/components/icons/IconDumbbell.vue";
import IconTrash from "~/components/icons/IconTrash.vue";

const { data: workouts, pending, refresh } = await useFetch<Workout[]>("/api/workouts");
const expandedWorkouts = ref<number[]>([]);
const workoutDetails = ref<Record<number, WorkoutWithSets>>({});

const completedWorkouts = computed(() => {
  return (workouts.value ?? []).filter((w: Workout) => w.completedAt);
});

async function toggleExpand(workoutId: number) {
  const index = expandedWorkouts.value.indexOf(workoutId);
  if (index === -1) {
    expandedWorkouts.value.push(workoutId);
    // Load workout details if not already loaded
    if (!workoutDetails.value[workoutId]) {
      const details = await $fetch<WorkoutWithSets>(`/api/workouts/${workoutId}`);
      workoutDetails.value[workoutId] = details;
    }
  } else {
    expandedWorkouts.value.splice(index, 1);
  }
}

function groupSetsByExercise(sets: WorkoutSetWithExercise[]) {
  const groups: Record<string, WorkoutSetWithExercise[]> = {};
  for (const set of sets) {
    if (!groups[set.exerciseName]) {
      groups[set.exerciseName] = [];
    }
    groups[set.exerciseName]!.push(set);
  }
  return groups;
}

async function deleteWorkout(id: number) {
  if (!confirm("Are you sure you want to delete this workout?")) return;
  
  await $fetch(`/api/workouts/${id}`, {
    method: "DELETE",
  });
  refresh();
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDuration(start: Date | string, end: Date | string) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}
</script>
