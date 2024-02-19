<template>
    <div class="resize"></div>
</template>

<style scoped>
.resize {
    width: var(--size-16);
    height: var(--size-16);
    background: var(--ui-60);
    bottom: 0;
    right: 0;
    transform: scale(var(--card-element-scale));
    transform-origin: 100% 100%;
    /* border-radius: 0 0 calc(var(--size-16) * 1) 0; */
    /* border: var(--ui-border-25); */
    position: absolute;
    z-index: 5;
}
</style>

