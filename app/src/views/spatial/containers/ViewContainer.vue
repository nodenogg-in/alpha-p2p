<template>
    <section class="container">
        <slot></slot>
    </section>
</template>

<style scoped>
.container {
    position: absolute;
    top: 0;
    z-index: 2;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(220, 220, 220);
}
</style>