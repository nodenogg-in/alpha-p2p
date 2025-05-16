<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'

defineProps(['data'])
</script>

<template>
    <NodeResizer />

    <!-- <Handle type="target" :position="Position.Left" /> -->
    <div class="resizable-container">
        {{ data.label }}
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