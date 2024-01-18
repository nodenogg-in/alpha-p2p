<script setup lang="ts">
import SpatialView from '@/microcosm/views/spatial/SpatialView.vue';
import { Container, Nav, Provider } from '.'

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
            <Container>
                <SpatialView />
            </Container>
        </div>
    </Provider>
</template>

<style scoped>
.microcosm-container {
    border-radius: 10px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}
</style>