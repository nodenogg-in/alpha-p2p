<script setup lang="ts">

import { starkdown } from 'starkdown'
import { computed } from 'vue';
import sanitize from 'sanitize-html'

const props = defineProps({
    content: {
        type: String,
        required: true
    },
})

const content = computed(() => sanitize(starkdown(props.content)))
</script>

<template>
    <div class="markdown-html" v-html="content" />
</template>

<style scoped>
div.markdown-html {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 10px;
}

div.markdown-html> :global(h1),
div.markdown-html> :global(h2),
div.markdown-html> :global(h3),
div.markdown-html> :global(h4),
div.markdown-html> :global(h5),
div.markdown-html> :global(h6) {
    font-weight: 600;
    line-height: 1.3em;
    padding: 0;
    margin: 0;
}

div.markdown-html> :global(hr) {
    border: initial;
    border-top: 1px solid currentColor;
}
</style>
