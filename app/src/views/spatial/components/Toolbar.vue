<script setup lang="ts">
import ToolButton from './ToolButton.vue'
import Icon from '@/components/icon/Icon.vue'
import { useCurrentSpatialView } from '@/views/spatial'

const view = useCurrentSpatialView()
</script>

<template>
  <div class="toolbar">
    <ToolButton v-for="[key, { name, command }] in view.toolbar()" :active="view.action.tool === key" :tooltip="name"
      :command="command" v-bind:key="`tool-${key}`" @click="view.setTool(key)">
      <Icon :type="key" :size="32" />
    </ToolButton>
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
  border-radius: calc(var(--ui-radius));
  padding: var(--size-4);
  gap: var(--size-2);
}

@media (prefers-color-scheme: dark) {
  div.toolbar {
    /* box-shadow: var(--ui-shadow-25); */
    background: var(--ui-90);
  }
}
</style>
