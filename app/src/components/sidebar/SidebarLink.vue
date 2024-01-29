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
    padding: 6px 6px 6px 12px;
    display: block;
    cursor: pointer;
    font-variation-settings: 'wght' 550;
    font-feature-settings: 'cv10' on, 'cv11' on, 'cv04' on, 'cv09' on, 'ss01' on, 'cv03' on, 'cv08' on, 'cv01' on;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-bottom: 1px;
    max-width: 100%;
    display: flex;
    align-items: center;
}

.active {
    color: var(--ui-100);
    background: var(--ui-0);
}

.link:not(.active):hover {
    background: var(--ui-accent-20);
    color: var(--ui-accent-100);
}
</style>