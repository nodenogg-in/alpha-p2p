<script setup lang="ts">
import { useApp } from '@/state'
import Collection from '@/components/Collection.vue'
import NodeCard from './components/NodeCard.vue';
import Scrollable from '@/components/html/Scrollable.vue';
const app = useApp()
</script>

<template>
    <Scrollable class="section" is="section">
        <Collection :component="NodeCard" :user_id="app.identity.user_id" />
    </Scrollable>
</template>

<style scoped>
.section {
    padding: var(--size-48);
    width: 100%;
    height: 100%;
}
</style>