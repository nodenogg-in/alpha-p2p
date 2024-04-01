<script setup lang="ts">
import { RouterView } from 'vue-router'
import { TooltipProvider } from 'radix-vue'
import AppMenu from '@/components/menu/AppMenu.vue'
</script>

<template>
  <TooltipProvider>
    <AppMenu />
    <Suspense>
      <RouterView />
    </Suspense>
  </TooltipProvider>
</template>
