<script setup lang="ts">
import { TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from 'radix-vue'
import type { PropType } from 'vue'
import KeyCommandIcon from './KeyCommandIcon.vue'

defineProps({
  delay: {
    type: Number,
    default: 30
  },
  command: {
    type: String
  },
  tooltip: {
    type: String,
    required: true
  },
  side: {
    type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
    default: 'top'
  },
  align: {
    type: String as PropType<'start' | 'center' | 'end'>,
    default: 'center'
  },
  sideOffset: {
    type: Number,
    default: 5
  },
  disableClosingTrigger: {
    type: Boolean,
    default: false
  }
})

defineEmits<{
  click: [e: Event]
}>()
</script>

<template>
  <TooltipRoot :delayDuration="delay" :disableClosingTrigger="disableClosingTrigger">
    <TooltipTrigger asChild>
      <slot></slot>
    </TooltipTrigger>
    <TooltipPortal>
      <TooltipContent class="tooltip-content" :side-offset="sideOffset" :side="side" :align="align">
        {{ tooltip }}
        <KeyCommandIcon v-if="command">
          {{ command }}
        </KeyCommandIcon>
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>

<style>
.tooltip-content {
  border-radius: var(--ui-radius);
  padding: 6px;
  color: var(--ui-mono-90);
  background-color: var(--ui-mono-0);
  user-select: none;
  z-index: 1000;
  display: flex;
  line-height: 1em;
  align-items: center;
}

.tooltip-content>span {
  margin-left: 0.4em;
}
</style>
