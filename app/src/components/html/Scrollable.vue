<script lang="ts" setup>
const props = defineProps({
    htmlTag: {
        type: String,
        default: 'div'
    },
    html: {
        type: String,
    }
})
</script>

<template>
    <component :is="props.htmlTag" class="container" v-bind="$attrs">
        <slot></slot>
    </component>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    scroll-behavior: smooth;
    overflow-y: scroll;
    overflow-x: hidden;
    position: absolute;
    top: 0;
    left: 0;
}

.container::-webkit-scrollbar {
    width: 6px;
}

.container::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0);
}

.container::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    border-radius: 3px;
}

.container::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 1);
}
</style>