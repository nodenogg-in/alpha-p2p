<script lang="ts" setup>
const props = defineProps({
    htmlTag: {
        type: String,
        default: 'div'
    },
    class: {
        type: String,
        default: 'box'
    },
    html: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    }
})
</script>

<template>
    <component :is="props.htmlTag" :class="{ active: props.active, [props.class]: true, container: true, ui: true }"
        v-bind="$attrs">
        <slot></slot>
    </component>
</template>

<style scoped>
.container {
    width: 100%;
}

.container.active {
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
    background: rgba(0, 0, 0, 1.0);
}

@media (prefers-color-scheme: dark) {
    .container::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.5);
    }

    .container::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 1.0);
    }

}
</style>