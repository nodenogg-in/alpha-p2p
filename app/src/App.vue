<script setup lang="ts">
import { RouterView } from 'vue-router'
import { TooltipProvider } from 'radix-vue'
</script>

<template>
  <TooltipProvider>
    <Suspense>
      <RouterView />
    </Suspense>
  </TooltipProvider>
</template>
