<template>
  <div>
    <!-- No Active Workout -->
    <div v-if="!activeWorkout" class="text-center py-16">
      <div class="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <IconDumbbell class="w-12 h-12 text-dark-500" />
      </div>
      <h1 class="text-2xl font-bold text-white mb-2">Ready to Train?</h1>
      <p class="text-dark-400 mb-8 max-w-md mx-auto">
        Start a new workout session to begin logging your exercises and track your progress.
      </p>
      <JButton @click="startWorkout" class="text-lg px-8 py-3">
        <IconPlay class="w-6 h-6 mr-2" />
        Start Workout
      </JButton>
    </div>

    <!-- Active Workout -->
    <div v-else>
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <input
            v-model="workoutName"
            type="text"
            placeholder="Workout Name (optional)"
            class="bg-transparent text-2xl font-bold text-white placeholder-dark-600 focus:outline-none border-b-2 border-transparent focus:border-accent-500 transition-colors"
            @blur="updateWorkoutName"
          />
          <p class="text-dark-400 mt-1">
            Started {{ formatTime(activeWorkout.startedAt) }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <JButton @click="finishWorkout">
            <IconCheck class="w-5 h-5 mr-2" />
            Finish
          </JButton>
        </div>
      </div>

      <!-- Exercise Sets grouped by exercise -->
      <div class="space-y-6 mb-8">
        <div v-for="(group, exerciseId) in groupedSets" :key="exerciseId" class="card">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-white">{{ group.exerciseName }}</h3>
              <span class="text-sm text-dark-400">{{ group.muscleGroup }}</span>
            </div>
            <JButton 
              variant="ghost"
              @click="addSetToExercise(Number(exerciseId), group.exerciseName, group.muscleGroup)"
              class="text-accent-400"
            >
              <IconPlus class="w-5 h-5" />
            </JButton>
          </div>
          
          <!-- Sets Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-dark-400 text-sm">
                  <th class="text-left py-2 pr-4 font-medium">Set</th>
                  <th class="text-left py-2 pr-4 font-medium">Weight</th>
                  <th class="text-left py-2 pr-4 font-medium">Reps</th>
                  <th class="text-left py-2 font-medium">RPE</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="set in group.sets" :key="set.id" class="border-t border-dark-700">
                  <td class="py-3 pr-4">
                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-dark-700 text-sm font-medium">
                      {{ set.setNumber }}
                    </span>
                  </td>
                  <td class="py-3 pr-4">
                    <span class="text-white font-medium">{{ set.weight ?? '-' }}</span>
                    <span v-if="set.weight" class="text-dark-500 text-sm ml-1">lbs</span>
                  </td>
                  <td class="py-3 pr-4">
                    <span class="text-white font-medium">{{ set.reps ?? '-' }}</span>
                  </td>
                  <td class="py-3">
                    <span v-if="set.rpe" class="inline-flex items-center px-2 py-0.5 rounded text-sm" :class="getRpeColor(set.rpe)">
                      {{ set.rpe }}
                    </span>
                    <span v-else class="text-dark-500">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Add Exercise -->
      <button
        @click="showExerciseSelector = true"
        class="w-full py-4 border-2 border-dashed border-dark-700 rounded-xl text-dark-400 hover:text-white hover:border-dark-600 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <IconPlus class="w-5 h-5" />
        Add Exercise
      </button>
    </div>

    <!-- Exercise Selector Modal -->
    <ExerciseSelectorModal
      v-if="showExerciseSelector"
      @close="showExerciseSelector = false"
      @select="openSetLogger"
    />

    <!-- Set Logger Modal -->
    <SetLoggerModal
      v-if="setLoggerData"
      :exercise-id="setLoggerData.exerciseId"
      :exercise-name="setLoggerData.exerciseName"
      :workout-id="activeWorkout?.id ?? 0"
      @close="setLoggerData = null"
      @save="logSet"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "#imports";
import { $fetch } from "ofetch";
import type { Workout, Exercise, WorkoutWithSets, WorkoutSetWithExercise } from "~/types/database";
import JButton from "~/components/form/JButton.vue";
import IconDumbbell from "~/components/icons/IconDumbbell.vue";
import IconPlay from "~/components/icons/IconPlay.vue";
import IconCheck from "~/components/icons/IconCheck.vue";
import IconPlus from "~/components/icons/IconPlus.vue";

const router = useRouter();

const activeWorkout = ref<WorkoutWithSets | null>(null);
const workoutName = ref("");
const showExerciseSelector = ref(false);
const setLoggerData = ref<{ exerciseId: number; exerciseName: string } | null>(null);

// Check for active workout on mount
onMounted(async () => {
  const workouts = await $fetch<Workout[]>("/api/workouts");
  const active = workouts.find((w: Workout) => !w.completedAt);
  if (active) {
    await loadWorkout(active.id);
  }
});

async function loadWorkout(id: number) {
  const workout = await $fetch<WorkoutWithSets>(`/api/workouts/${id}`);
  activeWorkout.value = workout;
  workoutName.value = workout.name ?? "";
}

async function startWorkout() {
  const workout = await $fetch<Workout>("/api/workouts", {
    method: "POST",
    body: {},
  });
  activeWorkout.value = { ...workout, sets: [] };
}

async function updateWorkoutName() {
  if (!activeWorkout.value) return;
  await $fetch(`/api/workouts/${activeWorkout.value.id}`, {
    method: "PUT",
    body: { name: workoutName.value || null },
  });
}

async function finishWorkout() {
  if (!activeWorkout.value) return;
  await $fetch(`/api/workouts/${activeWorkout.value.id}`, {
    method: "PUT",
    body: { completed: true, name: workoutName.value || null },
  });
  activeWorkout.value = null;
  workoutName.value = "";
  router.push("/history");
}

const groupedSets = computed(() => {
  if (!activeWorkout.value) return {};
  
  const groups: Record<number, { exerciseName: string; muscleGroup: string; sets: WorkoutSetWithExercise[] }> = {};
  
  for (const set of activeWorkout.value.sets) {
    if (!groups[set.exerciseId]) {
      groups[set.exerciseId] = {
        exerciseName: set.exerciseName,
        muscleGroup: set.muscleGroup,
        sets: [],
      };
    }
    groups[set.exerciseId]!.sets.push(set);
  }
  
  return groups;
});

function openSetLogger(exercise: Exercise) {
  setLoggerData.value = {
    exerciseId: exercise.id,
    exerciseName: exercise.name,
  };
  showExerciseSelector.value = false;
}

function addSetToExercise(exerciseId: number, exerciseName: string, muscleGroup: string) {
  setLoggerData.value = {
    exerciseId,
    exerciseName,
  };
}

async function logSet(data: { weight: number | null; reps: number | null; rpe: number | null }) {
  if (!activeWorkout.value || !setLoggerData.value) return;
  
  await $fetch("/api/sets", {
    method: "POST",
    body: {
      workoutId: activeWorkout.value.id,
      exerciseId: setLoggerData.value.exerciseId,
      ...data,
    },
  });
  
  // Reload workout to get updated sets
  await loadWorkout(activeWorkout.value.id);
  setLoggerData.value = null;
}

function formatTime(date: Date | string) {
  return new Date(date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function getRpeColor(rpe: number) {
  if (rpe <= 6) return "bg-green-500/20 text-green-400";
  if (rpe <= 8) return "bg-yellow-500/20 text-yellow-400";
  return "bg-red-500/20 text-red-400";
}
</script>
