<script setup lang="ts">
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogDescription,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger
} from 'radix-vue'
import Button from '../button/Button.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  onConfirm: {
    type: Function,
    required: true
  }
})
</script>

<template>
  <AlertDialogRoot>
    <AlertDialogTrigger as-child>
      <slot></slot>
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay class="overlay" />
      <AlertDialogContent class="content">
        <AlertDialogTitle class="title">
          {{ title }}
        </AlertDialogTitle>
        <AlertDialogDescription v-if="description" class="description">
          {{ description }}
        </AlertDialogDescription>
        <div class="tray">
          <AlertDialogCancel as-child>
            <Button> Cancel </Button>
          </AlertDialogCancel>
          <AlertDialogAction as-child @click="props.onConfirm">
            <Button> Confirm </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

<style scoped>
.overlay {
  background-color: hsla(var(--mono-base-hue), 8%, 10%, 0.5);
  position: fixed;
  inset: 0;
  z-index: 999;
  top: 0;
  left: 0;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.content {
  background-color: var(--ui-90);
  border-radius: 6px;
  position: fixed;
  top: var(--size-8);
  left: 50%;
  transform: translate(-50%, 0%);
  width: 90vw;
  max-width: 500px;
  max-height: 85vh;
  z-index: 1000;
  padding: var(--size-24);
  animation: contentShow 150ms cubic-bezier(0.25, 1, 0.3, 1);
  box-shadow: var(--ui-shadow-10);
}

:deep(.content:focus) {
  outline: none;
}

:deep(.title) {
  margin: 0;
  color: var(--mauve-12);
  font-size: 17px;
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
  justify-content: flex-end;
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
