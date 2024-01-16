<script setup lang="ts">
import { useRouteMicrocosms } from '@/utils/use-route-microcosms';
import MicrocosmPanel from '@/microcosm/new/MicrocosmPanel.vue';
import MicrocosmInstance from '@/microcosm/new/MicrocosmInstance.vue';
import MicrocosmPanelContainer from '@/microcosm/new/MicrocosmPanelContainer.vue';
const microcosms = useRouteMicrocosms()
</script>

<template>
    <MicrocosmPanelContainer :count="1 + microcosms.secondary.value.length" :spacing="20">
        <MicrocosmPanel v-if="microcosms.primary">
            <MicrocosmInstance :microcosm_uri="microcosms.primary.value" />
        </MicrocosmPanel>
        <MicrocosmPanel v-for="microcosm_uri in microcosms.secondary.value" v-bind:key="microcosm_uri">
            <MicrocosmInstance :microcosm_uri="microcosm_uri" />
        </MicrocosmPanel>
    </MicrocosmPanelContainer>
</template>