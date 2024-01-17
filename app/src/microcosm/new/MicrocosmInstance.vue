<script setup lang="ts">
import { ref } from 'vue';
import MicrocosmProvider from './MicrocosmProvider.vue';
import SpatialView from './views/SpatialView.vue';
import MicrocosmDebug from '../MicrocosmDebug.vue';
import Switch from './Switch.vue';

const props = defineProps({
    microcosm_uri: {
        type: String,
        required: true
    }
})

const shared = ref(true)

</script>

<template>
    <MicrocosmProvider :microcosm_uri="props.microcosm_uri">
        <nav>
            <span>
                <h1>{{ props.microcosm_uri }}</h1>
                <!-- <Switch v-model="shared" label="Shared" id="shared" /> -->
            </span>
            <MicrocosmDebug />
        </nav>

        <SpatialView /> 
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
</style>