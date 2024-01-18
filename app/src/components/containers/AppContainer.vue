<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useApp } from '@/stores/use-app'


const preventDefaults = (e: Event) => {
    e.preventDefault()
}

const events = ['dragenter', 'dragover', 'dragleave', 'drop']

onMounted(() => {
    events.forEach((eventName) => {
        document.body.addEventListener(eventName, preventDefaults)
    })
})

onUnmounted(() => {
    events.forEach((eventName) => {
        document.body.removeEventListener(eventName, preventDefaults)
    })
})

</script>
<template>
    <slot></slot>
</template>