<script setup lang="ts">
import type { PropType } from 'vue';
import { viewNames } from '@/utils/hooks/use-route-microcosms';
import { MicrocosmNav, MicrocosmProvider } from '.'
import * as Views from '@/views'
import ViewContainer from '@/views/spatial/containers/ViewContainer.vue';

const props = defineProps({
  microcosm_uri: {
    type: String,
    required: true
  },
  primary: {
    type: Boolean,
    default: false
  },
  view: {
    type: String as PropType<Views.ViewName>,
    required: true
  }
})

</script>

<template>
  <MicrocosmProvider :microcosm_uri="props.microcosm_uri">
    <ViewContainer :primary="props.primary">
      <MicrocosmNav v-if="props.primary" />
      <KeepAlive :include="viewNames">
        <component v-if="Views[props.view]" :is="Views[props.view]" />
      </KeepAlive>
    </ViewContainer>
  </MicrocosmProvider>
</template>

<style scoped>
.microcosm-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
