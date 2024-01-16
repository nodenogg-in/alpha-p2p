<script setup lang="ts">
const props = defineProps({
    count: {
        type: Number,
        default: 1
    },
    spacing: {
        type: Number,
        default: 10
    }
})
</script>
<template>
    <section class="panel-container" :style="{
        padding: `${props.spacing}px`,
        gridColumnGap: `${props.spacing}px`,
        gridTemplateColumns: `repeat(${props.count}, 1fr)`
    }">
        <slot></slot>
    </section>
</template>

<style scoped>
.panel-container {
    position: relative;
    width: 100%;
    height: 100vh;
    display: grid;
    grid-template-rows: repeat(auto-fill, 100%);
}
</style>