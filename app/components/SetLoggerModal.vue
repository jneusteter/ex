<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        @click="$emit('close')"
      ></div>

      <!-- Modal -->
      <div class="relative bg-dark-800 border border-dark-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-dark-700">
          <div>
            <h2 class="text-lg font-semibold text-white">Log Set</h2>
            <p class="text-sm text-dark-400">{{ exerciseName }}</p>
          </div>
          <JButton variant="ghost" @click="$emit('close')" class="p-2 -mr-2">
            <IconX class="w-5 h-5" />
          </JButton>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Weight Input -->
          <div>
            <label class="label">Weight (lbs)</label>
            <div class="flex items-center gap-3">
              <JButton
                variant="secondary"
                @click="adjustWeight(-5)"
                class="w-12 h-12 text-xl"
              >
                -
              </JButton>
              <input
                v-model.number="form.weight"
                type="number"
                step="0.5"
                placeholder="0"
                class="input text-center text-2xl font-bold flex-1"
              />
              <JButton
                variant="secondary"
                @click="adjustWeight(5)"
                class="w-12 h-12 text-xl"
              >
                +
              </JButton>
            </div>
          </div>

          <!-- Reps Input -->
          <div>
            <label class="label">Reps</label>
            <div class="flex items-center gap-3">
              <JButton
                variant="secondary"
                @click="adjustReps(-1)"
                class="w-12 h-12 text-xl"
              >
                -
              </JButton>
              <input
                v-model.number="form.reps"
                type="number"
                min="0"
                placeholder="0"
                class="input text-center text-2xl font-bold flex-1"
              />
              <JButton
                variant="secondary"
                @click="adjustReps(1)"
                class="w-12 h-12 text-xl"
              >
                +
              </JButton>
            </div>
          </div>

          <!-- RPE Input -->
          <div>
            <label class="label">RPE (Rate of Perceived Exertion)</label>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="n in [6, 7, 8, 9, 10]"
                :key="n"
                type="button"
                @click="form.rpe = form.rpe === n ? null : n"
                class="py-3 rounded-lg font-medium transition-all"
                :class="form.rpe === n 
                  ? getRpeButtonColor(n) 
                  : 'bg-dark-700 text-dark-300 hover:bg-dark-600'"
              >
                {{ n }}
              </button>
            </div>
            <p class="text-xs text-dark-500 mt-2">
              6 = Easy warmup, 8 = Could do 2 more, 10 = Maximum effort
            </p>
          </div>

          <!-- Submit -->
          <JButton type="submit" class="w-full py-3 text-lg">
            <IconCheck class="w-5 h-5 mr-2" />
            Log Set
          </JButton>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import IconX from "~/components/icons/IconX.vue";
import IconCheck from "~/components/icons/IconCheck.vue";

const props = defineProps<{
  exerciseId: number;
  exerciseName: string;
  workoutId: number;
}>();

const emit = defineEmits<{
  close: [];
  save: [data: { weight: number | null; reps: number | null; rpe: number | null }];
}>();

const form = reactive({
  weight: null as number | null,
  reps: null as number | null,
  rpe: null as number | null,
});

function adjustWeight(delta: number) {
  form.weight = Math.max(0, (form.weight ?? 0) + delta);
}

function adjustReps(delta: number) {
  form.reps = Math.max(0, (form.reps ?? 0) + delta);
}

function getRpeButtonColor(rpe: number) {
  if (rpe <= 7) return "bg-green-500 text-white";
  if (rpe <= 8) return "bg-yellow-500 text-white";
  return "bg-red-500 text-white";
}

function handleSubmit() {
  emit("save", {
    weight: form.weight,
    reps: form.reps,
    rpe: form.rpe,
  });
}
</script>
