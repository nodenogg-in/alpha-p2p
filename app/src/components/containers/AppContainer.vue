<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useApp } from '@/stores/use-app'

useApp()

const preventDefaults = (e: Event) => {
    e.preventDefault()
}

const events = ['dragenter', 'dragover', 'dragleave', 'drop']

onMounted(() => {

    // document.addEventListener("wheel", (e) => {
    //     e.preventDefault();
    // }, { passive: false });
    // document.addEventListener("gesturestart", function (e) {
    //     e.preventDefault();
    //     document.body.style.zoom = 0.99;
    // });

    // document.addEventListener("gesturechange", function (e) {
    //     e.preventDefault();

    //     document.body.style.zoom = 0.99;
    // });
    // document.addEventListener("gestureend", function (e) {
    //     e.preventDefault();
    //     document.body.style.zoom = 1;
    // });

    // events.forEach((eventName) => {
    //     document.body.addEventListener(eventName, preventDefaults)
    // })
})

onUnmounted(() => {
    // events.forEach((eventName) => {
    //     document.body.removeEventListener(eventName, preventDefaults)
    // })
})

</script>
<template>
    <slot></slot>
</template>