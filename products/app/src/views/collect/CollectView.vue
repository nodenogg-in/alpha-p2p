<script setup lang="ts">
import { useApp, useCurrentMicrocosm } from '@/state'
const app = useApp()
const microcosm = useCurrentMicrocosm()
</script>

<template>
  <div>
    <section class="section">
      Collect view for {{ microcosm.microcosmUUID }}
    </section>
  </div>
</template>

<style scoped>
div {}

.section {
  padding: var(--size-48) var(--size-16);
  width: 100%;
  height: 100%;
  background: var(--ui-100);
}
</style>