<script setup lang="ts">
import { provide, watch, ref, onBeforeUnmount, onMounted } from 'vue'
import { useStore, type State, MICROCOSM_DATA_INJECTION_KEY, MICROCOSM_API_INJECTION_KEY } from '@/stores/use-demo-state'

const props = defineProps({
    microcosm_uri: {
        type: String,
        required: true
    },
})

const store = ref(useStore(props.microcosm_uri))
store.value.joinMicrocosm()

provide(MICROCOSM_DATA_INJECTION_KEY, store as any)

const createNode: State['createNode'] = (...props) =>
    store.value.createNode(...props)

const removeNode: State['removeNode'] = (...props) =>
    store.value.removeNode(...props)

const updateNode: State['updateNode'] = (...props) =>
    store.value.updateNode(...props)

provide(MICROCOSM_API_INJECTION_KEY, {
    createNode,
    removeNode,
    updateNode
})

const register = () => {
    if (store.value.uri !== props.microcosm_uri) {
        store.value?.leaveMicrocosm()
        store.value = useStore(props.microcosm_uri)
        store.value.joinMicrocosm()

    }
}

watch(props, register)

register()

onBeforeUnmount(() => {
    store.value.dispose()
})

</script>

<template>
    <slot v-if="!!store"></slot>
</template>