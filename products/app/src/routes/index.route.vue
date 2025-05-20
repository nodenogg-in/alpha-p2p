<script setup lang="ts">
import { useApp } from '@/state'
import { microcosm } from '@nodenogg.in/core';

const app = useApp()
</script>

<template>
  <main class="microcosm-list">
    <router-link v-for="m of app.microcosms" :class="{ link: true, ui: true, 'microcosm-card': true }" :to="{
      name: 'microcosm',
      params: {
        microcosmUUID: m.microcosmUUID
      }
    }">
      <span>{{ microcosm.parseMicrocosmUUID(m.microcosmUUID) }}</span>
    </router-link>
  </main>
</template>

<style scoped>
img {
  max-width: 100%;
}

.microcosm-list {
  padding: 4rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
  min-height: min-content;
  width: 100%;
  height: auto;
  align-content: flex-start;
}

.microcosm-card {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0;
  width: 100%;
  max-width: 300px;
  aspect-ratio: 2/1 !important;
  color: inherit;
}

.microcosm-card:hover {
  background-color: var(--ui-80);
}

.microcosm-card:focus {
  outline: 3px solid var(--ui-primary-100);
  background-color: var(--ui-primary-20);
}
</style>