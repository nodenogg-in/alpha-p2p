<script setup lang="ts">
import { useCurrentMicrocosm } from '@/state'
import CollectViewProvider from './CollectViewProvider.vue';

const microcosm = useCurrentMicrocosm()
</script>

<template>
    <CollectViewProvider :microcosm_uri="microcosm.microcosm_uri">
        <section>
            <h1>Collect view TBC</h1>
        </section>
    </CollectViewProvider>
</template>

<style scoped>
section {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>