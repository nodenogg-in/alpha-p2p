<script setup lang="ts">
import { computed } from 'vue';
import { useApp, useCurrentMicrocosm } from '@/state';

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
    <slot v-for="[node_id, node] in nodes" v-bind:key="`${node_id}-node-${user_id}`"
        :remote="app.identity.user_id !== user_id" :identity="identity" :node_id="node_id" :node="node">
    </slot>
</template>