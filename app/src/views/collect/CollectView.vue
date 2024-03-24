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
      <Collection :identity_uid="app.identity.identity_uid" v-slot="{ node, node_id, remote }">
        <NodeCard :node="node as Node<'html'>" :node_id="node_id" :remote="remote" />
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