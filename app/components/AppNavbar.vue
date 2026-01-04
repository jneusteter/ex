<template>
  <!-- Desktop Sidebar -->
  <aside class="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-dark-950 border-r border-dark-800">
    <!-- Logo -->
    <div class="flex items-center gap-3 px-6 py-5 border-b border-dark-800">
      <div class="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h4v12H4zM16 6h4v12h-4zM8 11h8v2H8z" />
        </svg>
      </div>
      <span class="text-xl font-bold text-white">LiftTrack</span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-1">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-all duration-200"
        active-class="!bg-dark-800 !text-white"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="font-medium">{{ item.label }}</span>
      </NuxtLink>
    </nav>


  </aside>
</template>

<script setup lang="ts">
import IconHome from "~/components/icons/IconHome.vue";
import IconDumbbell from "~/components/icons/IconDumbbell.vue";
import IconClipboard from "~/components/icons/IconClipboard.vue";
import IconChart from "~/components/icons/IconChart.vue";

const navItems = [
  { path: "/", label: "Dashboard", icon: IconHome },
  { path: "/workout", label: "Workout", icon: IconDumbbell },
  { path: "/exercises", label: "Exercises", icon: IconClipboard },
  { path: "/history", label: "History", icon: IconChart },
];
</script>
