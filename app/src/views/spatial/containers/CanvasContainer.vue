<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import { useElementSize } from '@vueuse/core'
import {
  isMoveTool,
  isNewTool,
  isSelectTool,
  useCurrentSpatialView
} from '../stores/use-spatial-view'
import { useCursor } from '../stores/use-cursor'
import { parseFileToHTMLString } from '@/utils/parse-file'
import { isString } from '@/utils'
import ContextMenuVue from '@/components/ContextMenu.vue'
import { useCurrentMicrocosm } from '@/microcosm/stores/microcosm'
import type { ContextMenuOption } from '@/components/ContextMenu.vue'
import type { Node } from '@/microcosm/types/schema'
import type { IntersectionData } from '../utils/canvas-interaction.worker'

const emit = defineEmits<{
  (e: 'on-create-node', node: Node): void
  (e: 'on-drop-files', results: string[]): void
  (e: 'on-node-focus', node_id: string | null): void
  (e: 'on-selection', selection: IntersectionData): void
}>()

const view = useCurrentSpatialView()
const cursor = useCursor()
const microcosm = useCurrentMicrocosm()

const graphDOMElement = ref<HTMLElement | null>()

const handleFocus = (event: FocusEvent) => {
  const target = event.target as HTMLElement
  if (target && target.getAttribute('tabindex') === '0' && target.dataset.node_id) {
    event.preventDefault()
    target.focus({ preventScroll: true })
    emit('on-node-focus', target.dataset.node_id)
  } else {
    emit('on-node-focus', null)
  }
}

watchEffect(async () => {
  if (view.loaded) {
    microcosm
      .intersect(view.screenToCanvas(cursor.touchPoint), view.screenToCanvas(view.selectionBox))
      .then((data) => {
        emit('on-selection', data)
      })
  }
})

const onMouseUp = () => {
  if (isNewTool(view.tool)) {
    const data = view.screenToCanvas(view.selectionBox)
    if (data.width > 100 && data.height > 100) {
      emit('on-create-node', {
        type: 'html',
        content: '',
        ...data
      })
    }
  }
  cursor.finishAction()
  view.finishAction()
}

const onMouseDown = (e: MouseEvent) => {
  if (e.button === 2) {
    return
  }

  graphDOMElement.value?.focus()
  view.startAction()
  cursor.startAction()
}

const onTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 2) {
    cursor.startAction({ pinch: true })
    view.startAction(cursor.touchDistance)
  } else {
    view.startAction()
    cursor.startAction()
  }
}

const onTouchEnd = () => {
  cursor.finishAction()
  view.finishAction()
}

const handleScroll = (e: WheelEvent) => {
  const point = {
    x: e.clientX,
    y: e.clientY
  }

  const delta = {
    x: e.deltaX,
    y: e.deltaY
  }

  view.scroll(point, delta)
}

watch(cursor.touchPoint, () => {
  if (isMoveTool(view.tool) && view.active) {
    view.move(cursor.delta)
  }
  if (isSelectTool(view.tool) && view.active) {
    view.setSelection(cursor.origin, cursor.delta)
  }
  if (isNewTool(view.tool) && view.active) {
    view.setSelection(cursor.origin, cursor.delta)
  }
  if (cursor.pinching) {
    view.pinch(cursor.touchDistance)
  }
})

const { width, height } = useElementSize(graphDOMElement)

watch([width, height], () => {
  if (!graphDOMElement.value) {
    return
  }
  view.setContainer(graphDOMElement.value)
})

watchEffect(() => {
  view.tool && cursor.finishAction()
})

let inActiveTimeout: ReturnType<typeof setTimeout>

const dropActive = ref(false)

const setActive = () => {
  dropActive.value = true
  clearTimeout(inActiveTimeout)
}

const setInactive = () => {
  inActiveTimeout = setTimeout(() => {
    dropActive.value = false
  }, 50)
}

const onDrop = (e: DragEvent) => {
  if (e.dataTransfer) {
    setInactive()
    const files = [...e.dataTransfer.files]

    Promise.all(files.map(parseFileToHTMLString)).then((results) => {
      const htmlStrings = results.filter(isString)
      emit('on-drop-files', htmlStrings)
    })
  }
}

const ctxMenu: ContextMenuOption[] = [
  {
    type: 'button',
    id: 'duplicate',
    title: 'Duplicate'
  },
  {
    type: 'button',
    id: 'copy',
    title: 'Copy'
  },
  {
    type: 'button',
    id: 'cut',
    title: 'Cut'
  }
]
</script>

<template>
  <ContextMenuVue @change="console.log" :options="ctxMenu">
    <section
      role="presentation"
      :class="{
        container: true,
        ['drop-active']: dropActive,
        [view.tool]: true
      }"
      @wheel.prevent="handleScroll"
      @dragenter.prevent="setActive"
      @dragover.prevent="setActive"
      @focusin="handleFocus"
      @dragleave.prevent="setInactive"
      @drop.prevent="onDrop"
      @mousedown.prevent.self="onMouseDown"
      @touchend.prevent="onTouchEnd"
      @touchstart.prevent.self="onTouchStart"
      ref="graphDOMElement"
      tabindex="0"
      @mouseup.prevent.self="onMouseUp"
    >
      <slot></slot>
    </section>
  </ContextMenuVue>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  box-sizing: border-box !important;
  background: white;
  margin: 0;
}

.container:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgb(59, 102, 232);
}

.container.move {
  cursor: grab;
}

.container.new {
  cursor: crosshair;
}

.container::after {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.75);
  content: 'Add files';
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  position: absolute;
  z-index: 100;
  opacity: 0;
}

.container.drop-active::after {
  pointer-events: initial;
  opacity: 1;
}
</style>
@/microcosm/types/schema@/microcosm/stores/microcosm
