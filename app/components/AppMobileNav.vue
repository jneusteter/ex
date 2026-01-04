<template>
  <!-- Mobile Bottom Navigation -->
  <nav class="lg:hidden fixed bottom-0 inset-x-0 bg-dark-950 border-t border-dark-800 px-2 pb-safe">
    <div class="flex items-center justify-around py-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-dark-500 hover:text-white transition-colors"
        active-class="!text-accent-500"
      >
        <component :is="item.icon" class="w-6 h-6" />
        <span class="text-xs font-medium">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import IconHome from "~/components/icons/IconHome.vue";
import IconDumbbell from "~/components/icons/IconDumbbell.vue";
import IconClipboard from "~/components/icons/IconClipboard.vue";
import IconChart from "~/components/icons/IconChart.vue";

const navItems = [
  { path: "/", label: "Home", icon: IconHome },
  { path: "/workout", label: "Workout", icon: IconDumbbell },
  { path: "/exercises", label: "Exercises", icon: IconClipboard },
  { path: "/history", label: "History", icon: IconChart },
];
</script>
