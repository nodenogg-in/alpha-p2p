<script setup lang="ts">
import { computed } from 'vue'
import NodeCard from './card/NodeCard.vue'
import { useApp, useCurrentMicrocosm, useYNodeCollection } from '@/state'

const props = defineProps({
    user_id: {
        type: String,
        required: true
    }
})

const app = useApp()
const microcosm = useCurrentMicrocosm()

const user = computed(() => ({
    nodes: useYNodeCollection(microcosm.getNodes(props.user_id)),
    remote: app.identity.user_id !== props.user_id,
    identity: microcosm.getUser(props.user_id)
}))
</script>

<template>
    <NodeCard v-for="[node_id, node] in user.nodes.value" v-bind:key="`${node_id}-node-${props.user_id}`" :node="node"
        :identity="user.identity" :remote="user.remote" :node_id="node_id" />
</template>@/core/stores