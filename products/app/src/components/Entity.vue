<script lang="ts" setup>
import { onBeforeUnmount, ref, type PropType } from 'vue';
import type { Entity, EntityLocation } from '@nodenogg.in/microcosm'
import { useCurrentMicrocosm } from '@/state';

const props = defineProps({
    entity: {
        type: String as PropType<EntityLocation>,
        required: true
    }
})

const microcosm = useCurrentMicrocosm()

const state = ref<Entity | undefined>(microcosm.api().getEntity(props.entity))

onBeforeUnmount(microcosm.api().events.entity.on(props.entity, (entity) => {
    state.value = entity
}))

</script>

<template>
    <slot :entity="state" v-if="state" />
</template>
