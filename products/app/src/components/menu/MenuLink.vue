<script setup lang="ts">
import { parseMicrocosmID, type MicrocosmReference } from '@nodenogg.in/microcosm'
import type { PropType } from 'vue'

const props = defineProps({
  microcosm: {
    type: Object as PropType<MicrocosmReference>,
    required: true
  },
  active: {
    type: Boolean
  }
})
</script>

<template>
  <router-link v-bind="$attrs" :class="{ link: true, active, ui: true }" :to="{
    name: 'microcosm',
    params: {
      microcosmID: props.microcosm.microcosmID
    }
  }">
    <span>{{ parseMicrocosmID(microcosm.microcosmID).title }}</span>
  </router-link>
</template>

<style scoped>
.link {
  padding: var(--size-8);
  display: block;
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 100%;
  border-radius: var(--ui-radius);
  height: var(--size-32);
  width: 100%;
  user-select: none;
  display: flex;
  align-items: center;
  color: var(--ui-30);
  text-decoration: none;
}

/* .link::before {
    color: var(--ui-40);
    content: '/';
} */

.link:focus:not(.active) {
  box-shadow: var(--ui-shadow-primary);
}

.active {
  background: var(--ui-0);
  color: var(--ui-100);
}

.link:not(.active):hover {
  background: var(--ui-80);
  color: var(--ui-0);
}
</style>
