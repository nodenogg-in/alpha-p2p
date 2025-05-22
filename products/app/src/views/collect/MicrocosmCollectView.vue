<script setup lang="ts">
import { provide, ref, computed } from 'vue'
import { type Entity } from '@nodenogg.in/schema'
import { useCurrentMicrocosm } from '@/state'
import SimpleNode from './CollectNode.vue'
import { storeToRefs } from 'pinia'

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
const { setEditingNode, isEditing, update, deleteEntity, create } = microcosm


const handleCreateEntity = async () => {
  await create()
}

// Reactive reference to track the container element
const containerRef = ref<HTMLElement | null>(null)
</script>

<template>
  <div class="container" ref="containerRef">
    <div class="actions">
      <button @click="handleCreateEntity" class="button">New node</button>
    </div>
    <div class="nodes">
      <SimpleNode 
        v-for="e in entities" 
        v-bind:key="`node/${e.uuid}`" 
        :entity="e"
        :onChange="html => update(e, html)" 
        :onDelete="() => deleteEntity(e)"
        :isEditing="isEditing(e.uuid)" 
        @startEditing="setEditingNode(e.uuid)"
        @stopEditing="setEditingNode(null)" 
      />
    </div>
  </div>
</template>

<style scoped>
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

.actions {
  padding: var(--size-12) 0;
  gap: var(--size-4);
}

.nodes {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1em;
  max-width: 600px;
  margin: 0 auto;
  height: 100%;
  overflow-y: auto;
}

.container {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 2em;
  padding-top: 6em;
}
</style>