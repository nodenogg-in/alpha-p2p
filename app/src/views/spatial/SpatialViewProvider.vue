<script setup lang="ts">
import { provide } from 'vue'
import { createSpatialView, SPATIAL_VIEW_INJECTION_KEY } from './stores/use-spatial-view';

const props = defineProps({
    microcosm_uri: {
        type: String,
        required: true
    }
})

const store = createSpatialView(props.microcosm_uri)

provide(SPATIAL_VIEW_INJECTION_KEY, store)

</script>

<template>
    <slot v-if="!!store && props.microcosm_uri"></slot>
</template>../stores/use-spatial-view