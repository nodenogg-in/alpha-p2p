<script setup lang="ts">
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger
} from 'radix-vue'

const props = defineProps({
  active: {
    type: Boolean
  },
  keyCommand: {
    type: String
  },
  tooltip: {
    type: String,
    required: true
  },
  showCommand: {
    type: Boolean,
    default: false
  }
})

defineEmits<{
  click: [e: Event]
}>()
</script>

<template>
  <TooltipProvider>
    <TooltipRoot :delayDuration="30">
      <TooltipTrigger :class="{ active, 'icon-button': true }" @click="(e) => $emit('click', e)">
        <slot></slot>
        <span class="command mini" v-if="props.keyCommand && props.showCommand">{{
          props.keyCommand
        }}</span>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent class="tooltip-content" :side-offset="5">
          {{ props.tooltip
          }}<span class="command" v-if="props.keyCommand">{{ props.keyCommand }}</span>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<style>
.tooltip-content {
  border-radius: 4px;
  padding: 8px;
  font-size: 12px;
  background-color: black;
  color: white;
  box-shadow:
    hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  user-select: none;
  z-index: 1000;
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  animation-name: slideUpAndFade;

  will-change: transform, opacity;
}

/* .tooltip-content[data-state='delayed-open'][data-side='top'] {
    animation-name: slideDownAndFade;
}

.tooltip-content[data-state='delayed-open'][data-side='right'] {
    animation-name: slideLeftAndFade;
}

.tooltip-content[data-state='delayed-open'][data-side='bottom'] {
    animation-name: slideUpAndFade;
}

.tooltip-content[data-state='delayed-open'][data-side='left'] {
    animation-name: slideRightAndFade;
} */

.command {
  opacity: 0.5;
  margin-left: 0.5em;
}

.command.mini {
  /* opacity: 0.25; */
  position: absolute;
  bottom: 4px;
  right: 4px;
  font-size: 12px;
  font-weight: bold;
}

.icon-button {
  position: relative;
  font-family: inherit;
  height: 60px;
  width: 60px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: black;
  background-color: white;
  box-shadow: 0 2px 10px var(--black-a7);
  cursor: pointer;
}

.icon-button > svg {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  transform: scale(1) rotate(0deg);
}

.icon-button.active {
  z-index: 2;
  color: white;
  background-color: black;
}

.icon-button.active > svg {
  transform: scale(1.1) rotate(0deg);
}

.icon-button:hover {
  /* background-color: var(--grass-3); */
}

.icon-button:hover > svg {
  transform: translateY(-3px) scale(1.1) rotate(10deg);
}

.icon-button:focus {
  box-shadow: 0 0 0 2px black;
}

@keyframes slideUpAndFade {
  from {
    opacity: 0;
    transform: translateY(2px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideRightAndFade {
  from {
    opacity: 0;
    transform: translateX(-2px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideDownAndFade {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeftAndFade {
  from {
    opacity: 0;
    transform: translateX(2px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
