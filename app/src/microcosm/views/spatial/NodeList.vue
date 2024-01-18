<script setup lang="ts">
import NodeCard from './NodeCard.vue';
import { useApp } from '@/stores/use-app';
import { useCurrentMicrocosm, useYNodeCollection } from '@/stores/use-microcosm';
import { computed } from 'vue'

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
    identity: microcosm.identities.get(props.user_id)
}))

</script>

<template>
    <div class="list" v-if="user.nodes">
        <aside>
            {{ props.user_id }}
        </aside>
        <NodeCard v-for="[node_id, node] in user.nodes.value" v-bind:key="`${node_id}-node-${props.user_id}`" :node="node"
            :identity="user.identity" :remote="user.remote" :node_id="node_id" />
    </div>
</template>

<style scoped>
div.list {
    position: relative;
    width: 100%;
}

aside {
    background: black;
    color: white;
    padding: 5px;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0.25;
    z-index: 1;
}
</style>