<script setup lang="ts">
import { useApp, useCurrentMicrocosm } from '@/state'
import CollectViewProvider from './CollectViewProvider.vue';
import Collection from '@/components/Collection.vue'
import NodeCard from './components/NodeCard.vue';
import Scrollable from '@/components/html/Scrollable.vue';
const microcosm = useCurrentMicrocosm()
const app = useApp()
</script>

<template>
    <CollectViewProvider :microcosm_uri="microcosm.microcosm_uri">
        <Scrollable class="section" is="section">
            <Collection :component="NodeCard" :user_id="app.identity.user_id" />
        </Scrollable>
    </CollectViewProvider>
</template>

<style scoped>
.section {
    padding: var(--size-32);
    width: 100%;
    height: 100%;
}
</style>