<script setup lang="ts">
import { useRoute } from 'vue-router';
import MicrocosmContainer from '@/microcosm/MicrocosmContainer.vue';
const route = useRoute()
</script>

<template>
    <MicrocosmContainer v-if="route.params.microcosm_id" :microcosm_id="(route.params.microcosm_id as string)"
        :namespace_id="(route.params.namespace_id as string)" />
</template>

