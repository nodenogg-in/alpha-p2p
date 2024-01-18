<script setup lang="ts">
import { RouterView } from 'vue-router'
<<<<<<< HEAD
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
=======
import NNMenu from '@/components/NNMenu.vue';
import AppContainer from './components/containers/AppContainer.vue';
>>>>>>> 3175f29 (gradually resolving store quirks)
</script>

<template>
  <AppContainer>
    <NNMenu />
    <RouterView />
  </AppContainer>
</template>
>>>>>>> 251788f (switched to monorepo)
