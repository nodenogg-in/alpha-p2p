<script setup lang="ts">
import { RouterView } from 'vue-router'
<<<<<<< HEAD
import { TooltipProvider } from 'radix-vue';

import Menu from '@/components/menu/Menu.vue'

</script>

<template>
  <TooltipProvider>
    <Menu />
    <RouterView />
  </TooltipProvider>
</template>
=======
import NNMenu from './components/NNMenu.vue';
</script>

<template>
  <!-- <NNMenu /> -->
  <RouterView />
</template>
>>>>>>> 251788f (switched to monorepo)
