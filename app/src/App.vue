<script setup lang="ts">
import { RouterView } from 'vue-router'
import { TooltipProvider } from 'radix-vue';
import Sidebar from '@/components/sidebar/Sidebar.vue'
import { useCSSVariables } from '@/utils/css-variables';
useCSSVariables()
</script>

<template>
  <TooltipProvider>
    <Sidebar />
    <RouterView />
  </TooltipProvider>
</template>
