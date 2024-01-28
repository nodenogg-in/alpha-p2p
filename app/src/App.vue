<script setup lang="ts">
import { RouterView } from 'vue-router'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import { TooltipProvider } from 'radix-vue';
</script>

<template>
  <TooltipProvider>
    <Sidebar />
    <RouterView />
  </TooltipProvider>
</template>
