<script setup lang="ts">
import { SpatialView } from '@/views/spatial';
import { Nav, Provider } from '.'

const props = defineProps({
    microcosm_uri: {
        type: String,
        required: true
    }
})

</script>

<template>
    <Provider :microcosm_uri="props.microcosm_uri">
        <div class="microcosm-container">
            <Nav />
            <SpatialView />
        </div>
    </Provider>
</template>

<style scoped>
.microcosm-container {
    border-radius: 10px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
    width: 100%;
    height: 100%;
    padding-top: 50px;
    position: relative;
    overflow: hidden;
}
</style>