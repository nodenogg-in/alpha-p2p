<script setup lang="ts">
import { useApp } from '@/state'
const app = useApp()
</script>

<template>
  <div
    ref="element"
    :class="{
      container: true,
      'menu-open': app.state.menuOpen
    }"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
