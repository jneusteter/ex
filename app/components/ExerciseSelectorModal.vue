<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        @click="$emit('close')"
      ></div>

      <!-- Modal -->
      <div class="relative bg-dark-800 border border-dark-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[80vh] flex flex-col shadow-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-dark-700 shrink-0">
          <h2 class="text-lg font-semibold text-white">Select Exercise</h2>
          <button @click="$emit('close')" class="btn-ghost p-2 -mr-2">
            <IconX class="w-5 h-5" />
          </button>
        </div>

        <!-- Search -->
        <div class="px-6 py-4 border-b border-dark-700 shrink-0">
          <div class="relative">
            <IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search exercises..."
              class="input pl-10"
              autofocus
            />
          </div>
        </div>

        <!-- Exercise List -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="pending" class="flex items-center justify-center py-8">
            <div class="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div v-else-if="filteredExercises.length === 0" class="text-center py-8">
            <p class="text-dark-400">No exercises found</p>
            <NuxtLink to="/exercises" class="text-accent-400 hover:underline mt-2 inline-block">
              Add exercises
            </NuxtLink>
          </div>

          <div v-else class="space-y-2">
            <button
              v-for="exercise in filteredExercises"
              :key="exercise.id"
              @click="$emit('select', exercise)"
              class="w-full text-left px-4 py-3 rounded-lg bg-dark-700/50 hover:bg-dark-700 transition-colors"
            >
              <p class="font-medium text-white">{{ exercise.name }}</p>
              <p class="text-sm text-dark-400">{{ exercise.muscleGroup }}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Exercise } from "~/types/database";
import IconX from "~/components/icons/IconX.vue";
import IconSearch from "~/components/icons/IconSearch.vue";

defineEmits<{
  close: [];
  select: [exercise: Exercise];
}>();

const searchQuery = ref("");

const { data: exercises, pending } = await useFetch<Exercise[]>("/api/exercises");

const filteredExercises = computed(() => {
  if (!exercises.value) return [];
  if (!searchQuery.value) return exercises.value;
  
  const query = searchQuery.value.toLowerCase();
  return exercises.value.filter(e => 
    e.name.toLowerCase().includes(query) ||
    e.muscleGroup.toLowerCase().includes(query)
  );
});
</script>
