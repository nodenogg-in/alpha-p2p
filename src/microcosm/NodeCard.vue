<script setup lang="ts">

import { starkdown } from 'starkdown'
import { computed } from 'vue';
import sanitize from 'sanitize-html'

const props = defineProps({
    content: {
        type: String,
        default: ''
    }
})

const html = computed(() => sanitize(starkdown(props.content)))

</script>

<template>
    <div v-html="html" />
</template>

<style scoped>
div {
    color: black;
    background: pink;
    width: 300px;
    height: 200px;
}
</style>
