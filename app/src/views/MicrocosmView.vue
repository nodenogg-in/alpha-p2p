<script setup lang="ts">
import { useRouteMicrocosms } from '@/utils/use-route-microcosms';
import MicrocosmInstance from '@/microcosm/new/MicrocosmInstance.vue';
import MicrocosmPanelContainer from '@/microcosm/new/MicrocosmPanelContainer.vue';
const microcosms = useRouteMicrocosms()
</script>

<template>
    <MicrocosmPanelContainer :count="microcosms.length" :spacing="20">
        <MicrocosmInstance :microcosm_uri="microcosm_uri" v-for="microcosm_uri in microcosms" v-bind:key="microcosm_uri" />
    </MicrocosmPanelContainer>
</template>