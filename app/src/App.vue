<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import { TooltipProvider } from 'radix-vue';

import { setCSSVariables } from 'nodenoggin/ui';

import Menu from '@/components/menu/Menu.vue'

onMounted(setCSSVariables)
</script>

<template>
  <TooltipProvider>
    <Menu />
    <RouterView />
  </TooltipProvider>
</template>