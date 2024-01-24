<script setup lang="ts">
import { computed } from 'vue'
import NodeCard from './NodeCard.vue'
import { useApp } from '@/microcosm/stores/app'
import { useCurrentMicrocosm, useYNodeCollection } from '@/microcosm/stores/microcosm'
import { useCurrentSpatialView } from './stores/use-spatial-view'

const props = defineProps({
    user_id: {
        type: String,
        required: true
    }
})

const view = useCurrentSpatialView()
const app = useApp()
const microcosm = useCurrentMicrocosm()

const user = computed(() => ({
    nodes: useYNodeCollection(microcosm.getNodes(props.user_id)),
    remote: app.identity.user_id !== props.user_id,
    identity: microcosm.getUser(props.user_id)
}))
</script>

<template>
    <!-- <div class="list" v-if="user.nodes">
        <aside>
            {{ props.user_id }} ({{ user.identity?.username || 'Anonymous' }})
        </aside> -->
    <NodeCard v-for="[node_id, node] in user.nodes.value" v-bind:key="`${node_id}-node-${props.user_id}`" :node="node"
        :identity="user.identity" :remote="user.remote" :node_id="node_id" />
    <!-- </div> -->
</template>

<style scoped>
div.list {
    position: relative;
    width: 100%;
    padding: 20px;
}

aside {
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 5px;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    font-size: 10px;
}
</style>
@/microcosm/stores/use-app@/microcosm/stores/microcosm@/microcosm/stores/app
