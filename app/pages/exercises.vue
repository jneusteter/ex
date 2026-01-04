<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-white">Exercises</h1>
        <p class="text-dark-400 mt-1">Manage your exercise library</p>
      </div>
      <JButton @click="showModal = true">
        <IconPlus class="w-5 h-5 mr-2" />
        Add Exercise
      </JButton>
    </div>

    <!-- Search and Filter -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="relative flex-1">
        <IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search exercises..."
          class="input pl-10"
        />
      </div>
      <select v-model="selectedMuscleGroup" class="input sm:w-48">
        <option value="">All Muscle Groups</option>
        <option v-for="group in muscleGroups" :key="group" :value="group">
          {{ group }}
        </option>
      </select>
    </div>

    <!-- Exercise List -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <div class="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="filteredExercises.length === 0" class="text-center py-12">
      <IconDumbbell class="w-16 h-16 text-dark-600 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-dark-300 mb-2">No exercises found</h3>
      <p class="text-dark-500 mb-4">
        {{ searchQuery || selectedMuscleGroup ? 'Try adjusting your filters' : 'Get started by adding your first exercise' }}
      </p>
      <JButton v-if="!searchQuery && !selectedMuscleGroup" @click="showModal = true">
        <IconPlus class="w-5 h-5 mr-2" />
        Add Exercise
      </JButton>
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="exercise in filteredExercises"
        :key="exercise.id"
        class="card group hover:border-dark-600 transition-all duration-200"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-white group-hover:text-accent-400 transition-colors">
              {{ exercise.name }}
            </h3>
            <div class="flex items-center gap-3 mt-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-500/10 text-accent-400">
                {{ exercise.muscleGroup }}
              </span>
              <span v-if="exercise.equipment" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dark-700 text-dark-300">
                {{ exercise.equipment }}
              </span>
            </div>
            <p v-if="exercise.notes" class="text-dark-400 text-sm mt-3">{{ exercise.notes }}</p>
          </div>
          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <JButton variant="ghost" @click="editExercise(exercise)" class="p-2">
              <IconEdit class="w-4 h-4" />
            </JButton>
            <JButton variant="ghost" @click="deleteExercise(exercise.id)" class="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <IconTrash class="w-4 h-4" />
            </JButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <ExerciseModal
      v-if="showModal"
      :exercise="editingExercise"
      @close="closeModal"
      @save="saveExercise"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useFetch } from "#imports";
import { $fetch } from "ofetch";
import type { Exercise } from "~/types/database";
import IconPlus from "~/components/icons/IconPlus.vue";
import IconSearch from "~/components/icons/IconSearch.vue";
import IconDumbbell from "~/components/icons/IconDumbbell.vue";
import IconEdit from "~/components/icons/IconEdit.vue";
import IconTrash from "~/components/icons/IconTrash.vue";

const muscleGroups = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

const showModal = ref(false);
const editingExercise = ref<Exercise | null>(null);
const searchQuery = ref("");
const selectedMuscleGroup = ref("");

const { data: exercises, pending, refresh } = await useFetch<Exercise[]>("/api/exercises");

const filteredExercises = computed(() => {
  if (!exercises.value) return [];
  
  return exercises.value.filter((exercise: Exercise) => {
    const matchesSearch = !searchQuery.value || 
      exercise.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesMuscleGroup = !selectedMuscleGroup.value || 
      exercise.muscleGroup === selectedMuscleGroup.value;
    return matchesSearch && matchesMuscleGroup;
  });
});

function editExercise(exercise: Exercise) {
  editingExercise.value = exercise;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingExercise.value = null;
}

async function saveExercise(data: Partial<Exercise>) {
  if (editingExercise.value) {
    await $fetch(`/api/exercises/${editingExercise.value.id}`, {
      method: "PUT",
      body: data,
    });
  } else {
    await $fetch("/api/exercises", {
      method: "POST",
      body: data,
    });
  }
  closeModal();
  refresh();
}

async function deleteExercise(id: number) {
  if (!confirm("Are you sure you want to delete this exercise?")) return;
  
  await $fetch(`/api/exercises/${id}`, {
    method: "DELETE",
  });
  refresh();
}
</script>
