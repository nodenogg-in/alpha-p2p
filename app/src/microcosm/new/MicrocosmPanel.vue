<template>
    <article class="panel">
        <slot></slot>
    </article>
</template>

<style scoped>
.panel {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.1);
    overflow: hidden;
}
</style>