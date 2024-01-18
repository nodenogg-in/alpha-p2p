<script setup lang="ts">
import { provide, watch, onBeforeUnmount } from 'vue'
import { useMicrocosm, MICROCOSM_DATA_INJECTION_KEY } from '@/stores/use-microcosm';

const props = defineProps({
    microcosm_uri: {
        type: String,
        required: true
    },
})

let store = useMicrocosm(props.microcosm_uri)

provide(MICROCOSM_DATA_INJECTION_KEY, store)


const register = () => {
    if (store.microcosm_uri !== props.microcosm_uri) {
        store = useMicrocosm(props.microcosm_uri)
    }
}

watch(props, register)

register()

onBeforeUnmount(() => {
    store.leave()
})

</script>

<template>
    <slot v-if="!!store"></slot>
</template>