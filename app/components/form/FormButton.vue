<template>
  <component
    :is="to ? resolveComponent('NuxtLink') : 'button'"
    :to="to"
    :type="to ? undefined : type"
    :disabled="disabled"
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

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    to?: string;
  }>(),
  {
    variant: "primary",
    type: "button",
    disabled: false,
  }
);

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-danger",
};
</script>
