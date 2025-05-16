<script setup lang="ts">
import type { Entity } from '@nodenogg.in/core'
import { NodeResizer } from '@vue-flow/node-resizer'
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import Editor from '@/components/editor/Editor.vue'
import '@vue-flow/node-resizer/dist/style.css'

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
    <NodeResizer 
      :min-width="50" 
      :min-height="50" 
      :node-id="entity.uuid" 
      @resize="(_, newDimensions) => onResize(entity.uuid, newDimensions)"
    />

    <!-- <Handle type="target" :position="Position.Left" /> -->
    <div class="resizable-container">
        <Editor :value="entity?.data.content" :onChange="(html) => { }" :editable="false" @click="() => { }"
            @cancel="() => { }" />
            {{ entity.data }}


    </div>
    <!-- <Handle type="source" :position="Position.Right" /> -->
</template>

<style scoped>
.resizable-container {
    padding: var(--size-8);
    background: var(--ui-80);
    color: var(--ui-0);
    border-radius: var(--ui-radius);
    width: 100%;
    height: 100%;
}
</style>