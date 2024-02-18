<script setup lang="ts">
import { useApp, useCurrentMicrocosm } from '@/state';
import NodeCard from './card/NodeCard.vue'
import { computed } from 'vue';
import type { HTMLNode } from 'nodenoggin-core';

const microcosm = useCurrentMicrocosm()
const app = useApp()

const props = defineProps({
    user_id: {
        type: String,
        required: true
    }
})

const nodes = microcosm.useCollection(props.user_id)
const identity = computed(() => microcosm.getUser(props.user_id))

</script>

<template>
    <NodeCard v-for="[node_id, node] in nodes" v-bind:key="`${node_id}-node-${props.user_id}`" :node="(node as HTMLNode)"
        :remote="app.identity.user_id !== props.user_id" :identity="identity" :node_id="node_id" />
</template>