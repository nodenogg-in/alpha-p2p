<script setup lang="ts">
const props = defineProps({
    microcosm_uri: {
        type: String,
        required: true
    }
})
</script>

<template>
    <slot v-if="props.microcosm_uri"></slot>
</template>
