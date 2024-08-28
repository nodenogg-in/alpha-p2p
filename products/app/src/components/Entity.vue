<script lang="ts" setup>
import { type PropType } from 'vue';
import type { EntityLocation } from '@nodenogg.in/microcosm'
import { useCurrentMicrocosm } from '@/state';
// import { useSubscribable } from '@figureland/kit/state/vue'
import { useCurrentSpatialView } from '@/views/spatial';
import { storeToRefs } from 'pinia'
import { useSubscribable } from '@figureland/kit/state/vue';

const props = defineProps({
    entity: {
        type: String as PropType<EntityLocation>,
        required: true
    }
})

const microcosm = useCurrentMicrocosm()
const view = useCurrentSpatialView()
const { visible } = storeToRefs(view)

const state = useSubscribable(microcosm.api.query.subscribe(props.entity))

// const isVisible = computed(() => visible.value.includes(props.entity))

</script>

<template>
    <slot :entity="state" v-if="state" />
</template>
