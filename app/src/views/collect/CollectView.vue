<script setup lang="ts">
import { useApp } from '@/state'
import Collection from '@/components/node/Collection.vue'
import NodeCard from './components/NodeCard.vue'
import type { Node } from '@nodenogg.in/microcosm'
const app = useApp()
</script>

<template>
  <div>
    <section class="section">
      <Collection :identityID="app.identity.identityID" v-slot="{ node, nodeID, remote }">
        <NodeCard :node="node as Node<'html'>" :nodeID="nodeID" :remote="remote" />
      </Collection>
    </section>
  </div>
</template>

<style scoped>
div {}

.section {
  padding: var(--size-48) var(--size-16);
  width: 100%;
  height: 100%;
  background: var(--ui-100);
}
</style>