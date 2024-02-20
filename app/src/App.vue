<script setup lang="ts">
import { RouterView } from 'vue-router'
import { TooltipProvider } from 'radix-vue';

import Menu from '@/components/menu/Menu.vue'

</script>

<template>
  <TooltipProvider>
    <Menu />
    <RouterView />
  </TooltipProvider>
</template>