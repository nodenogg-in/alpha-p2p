<script setup lang="ts">
import { useRouteMicrocosms } from '@/utils/use-route-microcosms';
import MicrocosmPanel from '@/microcosm/new/MicrocosmPanel.vue';
import MicrocosmInstance from '@/microcosm/new/MicrocosmInstance.vue';
import MicrocosmPanelContainer from '@/microcosm/new/MicrocosmPanelContainer.vue';
const microcosms = useRouteMicrocosms()
</script>

<template>
    <MicrocosmPanelContainer :count="microcosms.length" :spacing="20">
        <MicrocosmPanel v-for="microcosm_uri in microcosms" v-bind:key="microcosm_uri">
            <MicrocosmInstance :microcosm_uri="microcosm_uri" />
        </MicrocosmPanel>
    </MicrocosmPanelContainer>
</template>