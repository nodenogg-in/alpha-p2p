<script setup lang="ts">
const props = defineProps({
    microcosm_uri: {
        type: String,
        required: true
    },
    active: {
        type: Boolean
    }
})
</script>

<template>
    <router-link :class="{ link: true, active: props.active }" :to="{
        name: 'microcosm',
        params: {
            view: 'spatial',
            microcosm_uri: props.microcosm_uri
        }
    }">
        {{ props.microcosm_uri }}
    </router-link>
</template>


<style scoped>
.link {
    border-radius: 4px;
    padding: 6px 6px;
    display: block;
    cursor: pointer;
    font-variation-settings: 'wght' 550;
    font-feature-settings: 'cv10' on, 'cv11' on, 'cv04' on, 'cv09' on, 'ss01' on, 'cv03' on, 'cv08' on, 'cv01' on;

}

.active {
    background: rgba(50, 50, 255, 0.2);
    color: rgba(50, 50, 255, 1);
}
</style>