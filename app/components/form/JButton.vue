<template>
  <component
    :is="to ? resolveComponent('NuxtLink') : 'button'"
    :to
    :type="to ? undefined : type"
    :disabled
    class="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[variantClasses[variant], $attrs.class]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { resolveComponent } from "vue";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

defineOptions({
  inheritAttrs: false,
});

const {
  variant = "primary",
  type,
  disabled = false,
  to,
} = defineProps<{
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  to?: string;
}>();

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500",
  secondary: "bg-dark-700 text-dark-100 hover:bg-dark-600 focus:ring-dark-500",
  ghost:
    "bg-transparent text-dark-300 hover:bg-dark-800 hover:text-dark-100 focus:ring-dark-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};
</script>
