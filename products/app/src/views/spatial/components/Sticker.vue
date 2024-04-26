<script lang="ts" setup>

defineProps({
    size: {
        type: Number,
        default: 300
    },
    text: {
        type: String,
        required: true
    }
})

</script>

<template>
    <div class="sticker"
        :style="`width: ${size}px; height: ${size}px; border-radius: ${size / 2}px; font-size: ${size * 0.8}px; top: ${-size / 2}px; left: ${-size / 2}px;`">
        {{ text }}
    </div>
</template>

<style scoped>
.sticker {
    background-color: coral;
    color: black;
    position: absolute;
    top: -25%;
    left: -25%;
    transform: rotate(12deg);
    z-index: 5;
    font-weight: 600;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
}
</style>