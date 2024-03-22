<script setup lang="ts">
import { RouterView } from 'vue-router'
import { TooltipProvider } from 'radix-vue'
// import { isValidMicrocosmURI } from '@nodenogg.in/microcosm';
import Menu from '@/components/menu/Menu.vue'
// const v = isValidMicrocosmURI()
</script>

<template>
  <TooltipProvider>
    <Menu />
    <Suspense>
      <RouterView />
    </Suspense>
  </TooltipProvider>
</template>
