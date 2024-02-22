
<script setup lang="ts">
import { useApp } from '@/state';

const app = useApp()
</script>

<template>
  <div :class="{
    container: true,
    'menu-open': app.menuOpen
  }">
    <slot></slot>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}

.container.menu-open {
  width: calc(100% - var(--app-menu-width));
  left: var(--app-menu-width);
}
</style>

