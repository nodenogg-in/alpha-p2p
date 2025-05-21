<script setup lang="ts">
import type { Entity } from '@nodenogg.in/core'
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import Editor from '@/components/editor/Editor.vue'
import { NodeResizer } from '@/components/node-resizer'
import { ref } from 'vue'

const { entity } = defineProps<{
  entity: Entity
}>()

const { updateNode } = useVueFlow()
const nodeRef = ref<HTMLElement | null>(null)

// Handle node resize events
const onResize = (nodeId: string, newDimensions: { width: number, height: number }) => {
  // Update the node dimensions in the Vue Flow state
  updateNode(nodeId, { dimensions: newDimensions })
}

// Handle keyboard events
const handleKeydown = (event: KeyboardEvent) => {
  // Handle Space or Enter key to enter edit mode
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    // Trigger edit mode
    // In the future, this would enable the editor
    console.log('Enter edit mode for node:', entity.uuid)
  }
}
</script>

<template>
  <NodeResizer :min-width="50" :min-height="50" :node-id="entity.uuid"
    @resize="(_, newDimensions) => onResize(entity.uuid, newDimensions)" />

  <div class="resizable-container" tabindex="0" @keydown="handleKeydown" ref="nodeRef">
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
  outline: none;
  transition: outline 0.2s ease;
}

.resizable-container:focus {
  outline: 2px solid var(--ui-primary-100);
  outline-offset: 2px;
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