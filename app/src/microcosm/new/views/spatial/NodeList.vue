<script setup lang="ts">
import NodeCard from '@/microcosm/NodeCard.vue';
import { useApp } from '@/stores/use-app';
import { useCurrentMicrocosm, useYNodeArray } from '@/stores/use-microcosm';
import { computed } from 'vue'

const props = defineProps({
    user_id: {
        type: String,
        required: true
    }
})

const app = useApp()

const { data, actions } = useCurrentMicrocosm()

const nodes = useYNodeArray(actions.getNodes(props.user_id) || [])
const remote = computed(() => app.identity.user_id !== props.user_id)
const identity = computed(() => data.identities?.get(props.user_id))

</script>

<template>
    <div class="list" v-if="nodes">
        <aside>
            {{ props.user_id }}
        </aside>
        <NodeCard v-for="(node, i) in nodes" v-bind:key="`${i}-node-${props.user_id}`" :node="node" :identity="identity"
            :remote="remote" />
    </div>
</template>

<style scoped>
div.list {
    position: relative;
    width: 100%;
    border: 1px solid red;
}

aside {
    background: black;
    color: white;
    padding: 5px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}
</style>