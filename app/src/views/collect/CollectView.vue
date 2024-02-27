<script setup lang="ts">
import { useApp } from '@/state'
import Collection from '@/components/node/Collection.vue'
import NodeCard from './components/NodeCard.vue';
import Scrollable from '@/components/html/Scrollable.vue';
import type { Node } from 'nodenoggin/schema';
const app = useApp()
</script>

<template>
    <Scrollable class="section" is="section">
        <Collection :user_id="app.identity.user_id" v-slot="{ node, node_id, remote }">
            <NodeCard :node="(node as Node<'html'>)" :node_id="node_id" :remote="remote" />
        </Collection>
    </Scrollable>
</template>

<style scoped>
.section {
    padding: var(--size-48) var(--size-16);
    width: 100%;
    height: 100%;
    background: var(--ui-100);
}
</style>