<script setup lang="ts">
import type { HTMLNode } from 'nodenoggin-core';
import { computed, type Component, type PropType } from 'vue';
import { useApp, useCurrentMicrocosm } from '@/state';

const microcosm = useCurrentMicrocosm()
const app = useApp()

const props = defineProps({
    user_id: {
        type: String,
        required: true
    },
    component: {
        type: Object as PropType<Component>,
        required: true
    }
})

const nodes = microcosm.useCollection(props.user_id)
const identity = computed(() => microcosm.getUser(props.user_id))

</script>

<template>
    <component :is="props.component" v-for="[node_id, node] in nodes" v-bind:key="`${node_id}-node-${props.user_id}`"
        :node="(node as HTMLNode)" :remote="app.identity.user_id !== props.user_id" :identity="identity"
        :node_id="node_id" />
</template>