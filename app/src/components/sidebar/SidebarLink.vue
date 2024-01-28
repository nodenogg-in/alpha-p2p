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
    box-sizing: border-box;
    border-radius: 4px;
    padding: 6px 0px 6px 6px;
    display: block;
    cursor: pointer;
    font-variation-settings: 'wght' 550;
    font-feature-settings: 'cv10' on, 'cv11' on, 'cv04' on, 'cv09' on, 'ss01' on, 'cv03' on, 'cv08' on, 'cv01' on;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.active {
    background: rgba(0, 0, 0, 1);
    color: rgba(255, 255, 255, 1);
}
</style>