<template>
  <div>
    <!-- Welcome Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Welcome back!</h1>
      <p class="text-dark-400">Track your progress and crush your goals.</p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="card">
        <p class="text-dark-400 text-sm mb-1">This Week</p>
        <p class="text-3xl font-bold text-white">{{ stats.workoutsThisWeek }}</p>
        <p class="text-dark-500 text-sm">workouts</p>
      </div>
      <div class="card">
        <p class="text-dark-400 text-sm mb-1">Total Sets</p>
        <p class="text-3xl font-bold text-white">{{ stats.totalSetsThisWeek }}</p>
        <p class="text-dark-500 text-sm">this week</p>
      </div>
      <div class="card">
        <p class="text-dark-400 text-sm mb-1">Total Volume</p>
        <p class="text-3xl font-bold text-white">{{ formatNumber(stats.volumeThisWeek) }}</p>
        <p class="text-dark-500 text-sm">lbs lifted</p>
      </div>
      <div class="card">
        <p class="text-dark-400 text-sm mb-1">Streak</p>
        <p class="text-3xl font-bold text-accent-400">{{ stats.streak }}</p>
        <p class="text-dark-500 text-sm">days</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold text-white mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NuxtLink to="/workout" class="card group hover:border-accent-500/50 transition-all duration-200">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center group-hover:bg-accent-500/20 transition-colors">
              <IconDumbbell class="w-6 h-6 text-accent-400" />
            </div>
            <div>
              <h3 class="font-semibold text-white group-hover:text-accent-400 transition-colors">Start Workout</h3>
              <p class="text-sm text-dark-400">Begin a new training session</p>
            </div>
          </div>
        </NuxtLink>
        <NuxtLink to="/exercises" class="card group hover:border-blue-500/50 transition-all duration-200">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <IconClipboard class="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 class="font-semibold text-white group-hover:text-blue-400 transition-colors">Manage Exercises</h3>
              <p class="text-sm text-dark-400">Add or edit your exercise library</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Workouts -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-white">Recent Workouts</h2>
        <NuxtLink to="/history" class="text-sm text-accent-400 hover:underline">
          View all
        </NuxtLink>
      </div>

      <div v-if="pending" class="flex items-center justify-center py-8">
        <div class="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="!recentWorkouts.length" class="card text-center py-8">
        <IconDumbbell class="w-12 h-12 text-dark-600 mx-auto mb-3" />
        <p class="text-dark-400">No workouts yet. Start your first one!</p>
      </div>

      <div v-else class="space-y-3">
        <NuxtLink
          v-for="workout in recentWorkouts"
          :key="workout.id"
          :to="`/history`"
          class="card block group hover:border-dark-600 transition-all duration-200"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-white group-hover:text-accent-400 transition-colors">
                {{ workout.name || 'Workout' }}
              </h3>
              <p class="text-sm text-dark-400">
                {{ formatDate(workout.startedAt) }}
              </p>
            </div>
            <div class="text-right">
              <span v-if="workout.completedAt" class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent-500/10 text-accent-400 text-xs">
                <IconCheck class="w-3 h-3" />
                Completed
              </span>
              <span v-else class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs">
                In Progress
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Workout } from "~/server/database/schema";
import IconDumbbell from "~/components/icons/IconDumbbell.vue";
import IconClipboard from "~/components/icons/IconClipboard.vue";
import IconCheck from "~/components/icons/IconCheck.vue";

const { data: workouts, pending } = await useFetch<Workout[]>("/api/workouts");

const recentWorkouts = computed(() => {
  return (workouts.value ?? []).slice(0, 5);
});

// Calculate stats
const stats = computed(() => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const thisWeekWorkouts = (workouts.value ?? []).filter(w => {
    const started = new Date(w.startedAt);
    return started >= weekAgo && w.completedAt;
  });

  return {
    workoutsThisWeek: thisWeekWorkouts.length,
    totalSetsThisWeek: 0, // Would need sets data
    volumeThisWeek: 0, // Would need sets data
    streak: calculateStreak(workouts.value ?? []),
  };
});

function calculateStreak(workouts: Workout[]) {
  // Simple streak calculation
  const completed = workouts.filter(w => w.completedAt).map(w => new Date(w.startedAt).toDateString());
  const uniqueDays = [...new Set(completed)];
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    
    if (uniqueDays.includes(checkDate.toDateString())) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  
  return streak;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatNumber(num: number) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}
</script>
