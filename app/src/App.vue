<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppMenu from '@/components/menu/AppMenu.vue'
import { TooltipProvider } from 'radix-vue';
</script>

<template>
  <TooltipProvider>
    <AppMenu />
    <RouterView />
  </TooltipProvider>
</template>
