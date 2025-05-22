<script setup lang="ts">
import { RouterView } from 'vue-router'
import { TooltipProvider } from 'reka-ui'
import AppMenu from '@/components/menu/AppMenu.vue'
import { useApp } from './state';
const app = useApp()
</script>

<template>
  <TooltipProvider>
    <AppMenu v-if="app.state.showUI" />
    <Suspense>
      <RouterView />
    </Suspense>
  </TooltipProvider>
</template>
