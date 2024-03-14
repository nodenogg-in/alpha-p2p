<script setup lang="ts">
import type { MicrocosmReference } from '@nodenogg.in/core/schema'
import Dialog from '../dialog/Dialog.vue'
import { ContextMenu, ContextMenuItem } from '../context-menu'
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
  <ContextMenu>
    <router-link
      :class="{ link: true, active, ui: true }"
      :to="{
        name: 'microcosm',
        params: { microcosm_uri: props.microcosm.microcosm_uri }
      }"
    >
      {{ microcosm.microcosm_uri }}
      <small>{{ microcosm.lastAccessed }}</small>
    </router-link>
    <template v-slot:menu>
      <Dialog
        :title="`${microcosm.microcosm_uri}`"
        :onConfirm="console.log"
        description="Are you sure you want to delete this microcosm?"
      >
        <ContextMenuItem value="delete" :title="`Delete ${microcosm.microcosm_uri}`" />
      </Dialog>
      <ContextMenuItem value="duplicate" :title="`Duplicate`" @click="console.log" disabled />
    </template>
  </ContextMenu>
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
  background: var(--ui-70);
  color: var(--ui-0);
}
</style>
