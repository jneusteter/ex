<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        @click="$emit('close')"
      ></div>

      <!-- Modal -->
      <div class="relative bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md shadow-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-dark-700">
          <h2 class="text-lg font-semibold text-white">
            {{ exercise ? 'Edit Exercise' : 'Add Exercise' }}
          </h2>
          <JButton variant="ghost" @click="$emit('close')" class="p-2 -mr-2">
            <IconX class="w-5 h-5" />
          </JButton>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
          <div>
            <label class="label">Exercise Name</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="e.g. Bench Press"
              class="input"
              required
            />
          </div>

          <div>
            <label class="label">Muscle Group</label>
            <select v-model="form.muscleGroup" class="input" required>
              <option value="" disabled>Select muscle group</option>
              <option v-for="group in muscleGroups" :key="group" :value="group">
                {{ group }}
              </option>
            </select>
          </div>

          <div>
            <label class="label">Equipment (Optional)</label>
            <select v-model="form.equipment" class="input">
              <option value="">No equipment / Bodyweight</option>
              <option v-for="eq in equipment" :key="eq" :value="eq">
                {{ eq }}
              </option>
            </select>
          </div>

          <div>
            <label class="label">Notes (Optional)</label>
            <textarea
              v-model="form.notes"
              placeholder="Any additional notes..."
              rows="3"
              class="input resize-none"
            ></textarea>
          </div>

          <div class="flex gap-3 pt-2">
            <JButton variant="secondary" @click="$emit('close')" class="flex-1">
              Cancel
            </JButton>
            <JButton type="submit" class="flex-1">
              {{ exercise ? 'Save Changes' : 'Add Exercise' }}
            </JButton>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import type { Exercise } from "~/types/database";
import JButton from "~/components/form/JButton.vue";
import IconX from "~/components/icons/IconX.vue";

const props = defineProps<{
  exercise?: Exercise | null;
}>();

const emit = defineEmits<{
  close: [];
  save: [data: Partial<Exercise>];
}>();

const muscleGroups = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];
const equipment = ["Barbell", "Dumbbell", "Machine", "Cable", "Kettlebell", "Resistance Band"];

const form = reactive({
  name: props.exercise?.name ?? "",
  muscleGroup: props.exercise?.muscleGroup ?? "",
  equipment: props.exercise?.equipment ?? "",
  notes: props.exercise?.notes ?? "",
});

function handleSubmit() {
  emit("save", {
    name: form.name,
    muscleGroup: form.muscleGroup,
    equipment: form.equipment || null,
    notes: form.notes || null,
  });
}
</script>
