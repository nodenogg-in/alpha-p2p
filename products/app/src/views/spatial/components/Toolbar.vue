<script setup lang="ts">
import ToolButton from './ToolButton.vue'
import Icon from '@/components/icon/Icon.vue'
import { useCurrentSpatialView } from '@/views/spatial'
import { storeToRefs } from 'pinia';

const view = useCurrentSpatialView()

const { tools, tool } = storeToRefs(view)
</script>

<template>
  <div class="toolbar">
    <template v-for="({ meta: { title, command, icon, hidden } }, key) in tools" v-bind:key="`tool-${key}`">
      <ToolButton :active="key === tool" :tooltip="title" v-if="!hidden" :command="command"
        @click="view.infinitykit.setTool(key)">
        <Icon v-if="icon" :type="icon" :size="32" />
      </ToolButton>
    </template>
  </div>
</template>

<style scoped>
div.toolbar {
  position: absolute;
  z-index: 200;
  inset: 0;
  top: initial;
  bottom: var(--size-12);
  display: flex;
  width: fit-content;
  height: fit-content;
  margin-inline: auto;
  background: var(--ui-95);
  box-shadow: var(--ui-container-shadow);
  /* border-radius: calc(var(--ui-radius)); */
  border-radius: 100px;
  /* padding: var(--size-4); */
  gap: var(--size-2);
}

@media (prefers-color-scheme: dark) {
  div.toolbar {
    /* box-shadow: var(--ui-shadow-25); */
    background: var(--ui-90);
  }
}
</style>
