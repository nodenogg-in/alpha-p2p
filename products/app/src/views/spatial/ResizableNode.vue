<script setup lang="ts">
import type { Entity } from '@nodenogg.in/core'
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import Editor from '@/components/editor/Editor.vue'
import { NodeResizer } from '@/components/node-resizer'

const { entity } = defineProps<{
  entity: Entity
}>()

const { updateNode } = useVueFlow()

// Handle node resize events
const onResize = (nodeId: string, newDimensions: { width: number, height: number }) => {
  // Update the node dimensions in the Vue Flow state
  updateNode(nodeId, { dimensions: newDimensions })
}
</script>

<template>
  <NodeResizer :min-width="50" :min-height="50" :node-id="entity.uuid"
    @resize="(_, newDimensions) => onResize(entity.uuid, newDimensions)" />

  <div class="resizable-container">
    <Editor :value="entity?.data.content" :onChange="(html) => { }" :editable="false" @click="() => { }"
      @cancel="() => { }" />
    {{ entity.data }}

    <div class="screen-space-element">
      Fixed Size Element
    </div>
  </div>
</template>

<style scoped>
.resizable-container {
  padding: var(--size-8);
  background: var(--ui-80);
  color: var(--ui-0);
  border-radius: var(--ui-radius);
  width: 100%;
  height: 100%;
  position: relative;
}

/* This element will maintain a consistent size regardless of zoom level */
.screen-space-element {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 5px 10px;
  background-color: var(--ui-primary-100);
  color: white;
  border-radius: 4px;
  font-size: 12px;

  /* The key part: scale inversely to the zoom level to maintain size */
  transform: scale(calc(1 / var(--zoom-value)));
  transform-origin: bottom right;
}
</style>