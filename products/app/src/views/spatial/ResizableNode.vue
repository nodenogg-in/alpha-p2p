<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'

defineProps(['data'])
</script>

<template>
    <NodeResizer :min-width="100" :min-height="100" />

    <!-- <Handle type="target" :position="Position.Left" /> -->
    <div style="padding: 10px; background: rgb(30,30,30); width: 100%; height: 100%; color: white;">{{ data.label }}</div>
    <!-- <Handle type="source" :position="Position.Right" /> -->
</template>
