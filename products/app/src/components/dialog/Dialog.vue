<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from 'radix-vue'
import Button from '../button/Button.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  onConfirm: {
    type: Function,
    required: true
  },
  open: {
    type: Boolean,
    required: true
  }
})
const model = defineModel<boolean>('open')
defineSlots<{ trigger: any, content: any, tray: any }>()
</script>

<template>
  <DialogRoot v-model:open="model">
    <DialogTrigger asChild>
      <slot name="trigger"></slot>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="overlay" />
      <DialogContent class="content">
        <VisuallyHidden>

          <DialogTitle class="title">
            {{ title }}
          </DialogTitle>
          <DialogDescription>
            {{ description }}
          </DialogDescription>
        </VisuallyHidden>
        <slot name="content"></slot>
        <slot name="tray"></slot>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.overlay {
  background: var(--ui-100);
  opacity: 0.4;
  position: fixed;
  inset: 0;
  z-index: 999;
  top: 0;
  left: 0;
}

.content {
  background-color: var(--ui-95);
  border-radius: var(--ui-radius);
  position: fixed;
  top: var(--size-64);
  left: 50%;
  transform: translate(-50%, 0%);
  width: 90vw;
  max-width: 500px;
  max-height: 85vh;
  z-index: 1000;
  box-shadow: var(--ui-shadow-10);
}


:deep(.content:focus) {
  outline: none;
}

:deep(.title) {
  margin: 0;
  text-align: center;
  padding: 0 0 var(--size-16) 0;
  font-weight: 500;
}

:deep(.description) {
  margin-bottom: 20px;
  color: var(--mauve-11);
  font-size: 15px;
  line-height: 1.5;
}

:deep(.tray) {
  display: flex;
  gap: var(--size-4);
  justify-content: center;
}

@keyframes overlayShow {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes contentShow {
  from {
    opacity: 0;
    transform: translate(-50%, -20%) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translate(-50%, 0%) scale(1.0);
  }
}
</style>
