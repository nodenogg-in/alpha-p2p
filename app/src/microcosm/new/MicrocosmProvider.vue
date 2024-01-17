<script setup lang="ts">
import { provide, watch, ref, onBeforeUnmount } from 'vue'
import { useMicrocosm, MICROCOSM_DATA_INJECTION_KEY, MICROCOSM_ACTIONS_INJECTION_KEY, type MicrocosmStore, type MicrocosmStoreData } from '@/stores/use-microcosm';

const props = defineProps({
    microcosm_uri: {
        type: String,
        required: true
    },
})

const store = ref(useMicrocosm(props.microcosm_uri))

provide(MICROCOSM_DATA_INJECTION_KEY, store as unknown as MicrocosmStoreData)

const create: MicrocosmStore['create'] = (...props) => store.value.create(...props)

const update: MicrocosmStore['update'] = (...props) => store.value.update(...props)

const deleteNode: MicrocosmStore['delete'] = (...props) => store.value.delete(...props)

const getNodes: MicrocosmStore['getNodes'] = (...props) => store.value.getNodes(...props)

provide(MICROCOSM_ACTIONS_INJECTION_KEY, {
    create,
    update,
    delete: deleteNode,
    getNodes,
    leave: store.value.leave,
    undo: store.value.undo,
    redo: store.value.redo,
})

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
</template>