<script setup lang="ts">
import { ref } from 'vue'
import {
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuViewport
} from 'radix-vue'

import MicrocosmListItem from './MicrocosmListItem.vue'

const currentTrigger = ref('')
</script>

<template>
  <NavigationMenuRoot v-model="currentTrigger" class="NavigationMenuRoot" :delayDuration="100000">
    <NavigationMenuList class="NavigationMenuList">
      <NavigationMenuItem>
        <NavigationMenuTrigger class="NavigationMenuTrigger">
          Learn
          <Icon icon="radix-icons:caret-down" class="CaretDown" aria-hidden />
        </NavigationMenuTrigger>
        <NavigationMenuContent class="NavigationMenuContent">
          <ul class="List one">
            <li :style="{ gridRow: 'span 3' }">
              <NavigationMenuLink asChild>
                <a class="Callout" href="/">
                  <img src="https://www.radix-vue.com/logo.svg">
                  <div class="CalloutHeading">Radix Primitives</div>
                  <p class="CalloutText">Unstyled, accessible components for Vue.</p>
                </a>
              </NavigationMenuLink>
            </li>

            <MicrocosmListItem href="https://stitches.dev/" title="Stitches">
              CSS-in-JS with best-in-class developer experience.
            </MicrocosmListItem>
            <MicrocosmListItem href="/colors" title="Colors">
              Beautiful, thought-out palettes with auto dark mode.
            </MicrocosmListItem>
            <MicrocosmListItem href="https://icons.radix-ui.com/" title="Icons">
              A crisp set of 15x15 icons, balanced and consistent.
            </MicrocosmListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>


      <NavigationMenuIndicator class="NavigationMenuIndicator">
        <div class="Arrow" />
      </NavigationMenuIndicator>
    </NavigationMenuList>

    <div class="ViewportPosition">
      <NavigationMenuViewport class="NavigationMenuViewport" />
    </div>
  </NavigationMenuRoot>
</template>
Collapse code
