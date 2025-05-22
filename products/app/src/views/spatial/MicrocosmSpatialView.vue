<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { VueFlow, useVueFlow, type NodeChange } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { EntitySchema } from '@nodenogg.in/schema'
import ResizableNode from './ResizableNode.vue'
import { useCurrentMicrocosm } from '@/state'

defineProps({
  view_id: {
    type: String,
    required: true
  },
  ui: {
    type: Boolean
  }
})

// Use the unified entity operations API
const microcosm = useCurrentMicrocosm()

const { entities } = storeToRefs(microcosm)
const { update, updatePosition, updateDimensions } = microcosm


const { onNodesChange, viewport } = useVueFlow()

// Reactive reference to track the canvas element
const canvasContainer = ref<HTMLElement | null>(null)

// Watch for zoom changes and update CSS variable
watch(() => viewport.value.zoom, (newZoom) => {
  if (canvasContainer.value) {
    canvasContainer.value.style.setProperty('--zoom-value', String(newZoom))
  }
})

const handleNodeChange = async (changes: NodeChange[]) => {
  // Process position and dimension changes
  for (const change of changes) {
    // Handle position changes
    if (change.type === 'position' && change.position) {
      const entity = entities.value.find(e => e.uuid === change.id)
      if (entity) {
        await updatePosition(entity, change.position)
      }
    }

    // Handle dimension changes
    if (change.type === 'dimensions' && change.dimensions) {
      const entity = entities.value.find(e => e.uuid === change.id)
      if (entity) {
        await updateDimensions(entity, change.dimensions)
      }
    }
  }
}

// Register the node change handler
onNodesChange(handleNodeChange)

const positionedNodes = computed(() => {
  return entities.value.filter(e => EntitySchema.utils.isType(e, 'html')).map((entity) => {
    const { width, height, x, y } = entity.data
    return {
      id: entity.uuid,
      type: 'resizable',
      data: entity,
      position: {
        x,
        y
      },
      dimensions: {
        width,
        height
      },
    }
  })
})
</script>

<template>
  <div class="container" ref="canvasContainer">
    <VueFlow :nodes="positionedNodes" fit-view-on-init class="pinia-flow" @nodes-change="handleNodeChange"
        pan-on-scroll>
      <Background variant="lines" patternColor="var(--ui-80)" />
      <!-- <MiniMap pannable zoomable class="mini-map" title="Mini map" /> -->
      <template #node-resizable="resizableNodeProps">
        <ResizableNode :entity="resizableNodeProps.data" />
      </template>
    </VueFlow>
  </div>
</template>

<style scoped>
.mini-map {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--ui-90);
  box-shadow: var(--ui-container-shadow);
  border-radius: var(--ui-radius);
  padding: 0;
}

.button {
  cursor: pointer;
  background: var(--ui-95);
  box-shadow: var(--ui-container-shadow);
  border-radius: calc(var(--ui-radius));
  padding: var(--size-8);
}

.button:hover {
  background: var(--ui-primary-100);
  color: var(--ui-100);
}

.nodes {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1em;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.pinia-flow {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.large {
  font-size: 14em;
  line-height: 0.95em;
}

.container {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 2em;
  padding-top: 6em;
}
</style>