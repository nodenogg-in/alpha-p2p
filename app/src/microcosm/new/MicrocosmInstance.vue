<script setup lang="ts">
import MicrocosmProvider from './MicrocosmProvider.vue';
import SpatialView from './views/SpatialView.vue';
import MicrocosmNav from './MicrocosmNav.vue';
import MicrocosmContainer from './MicrocosmContainer.vue';

const props = defineProps({
    microcosm_uri: {
        type: String,
        required: true
    }
})

</script>

<template>
    <MicrocosmProvider :microcosm_uri="props.microcosm_uri">
        <MicrocosmContainer>
            <MicrocosmNav />
            <SpatialView />
        </MicrocosmContainer>
    </MicrocosmProvider>
</template>

<style scoped>
nav {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    background: white;
    padding: 10px;
    z-index: 10;
    display: flex;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
}

nav>span {
    display: flex;
    align-items: center;
}

nav>span>h1 {
    font-size: 16px;
    margin-right: 10px;
}

.container {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.1);
    overflow: hidden;
}
</style>