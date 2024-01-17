<script setup lang="ts">
import { provide, watch, ref, onBeforeUnmount } from 'vue'
import { useMicrocosm, MICROCOSM_DATA_INJECTION_KEY, MICROCOSM_API_INJECTION_KEY } from '@/stores/use-microcosm';

const props = defineProps({
    microcosm_uri: {
        type: String,
        required: true
    },
})

const store = ref(useMicrocosm(props.microcosm_uri))

provide(MICROCOSM_DATA_INJECTION_KEY, store as any)

provide(MICROCOSM_API_INJECTION_KEY, store as any)

const register = () => {
    if (store.value.microcosm_uri !== props.microcosm_uri) {
        store.value = useMicrocosm(props.microcosm_uri)
    }
}

watch(props, register)

register()

onBeforeUnmount(() => {
    store.value.leave()
})

</script>

<template>
    <slot v-if="!!store"></slot>
</template>@/stores/use-microcosm@/stores/use-microcosm-store