<script setup lang="ts">
import { type PropType } from 'vue'
import type { Node } from 'nodenoggin/schema'
import { getCardStyle } from 'nodenoggin/ui'

const props = defineProps({
    color: {
        type: String
    },
    transform: {
        type: Object as PropType<Node<'html'>>
    },
    active: {
        type: Boolean
    },
    selected: {
        type: Boolean
    },
    hover: {
        type: Boolean
    }
})


</script>

<template>
    <article @focus.prevent v-bind="$attrs" :class="{
        card: true,
        active,
        selected,
        hover,
        spatial: !!transform
    }" :style="getCardStyle(color, transform)">
        <slot></slot>
    </article>
</template>

<style scoped>
article.card {
    color: var(--ui-10);
    background: var(--key-color-90);
    border-radius: var(--ui-radius);
    box-shadow: 0 0 0 var(--card-outline) hsla(var(--mono-base-hue), 8%, 50%, 0.25);
}

article.spatial {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0% 0%;
}

@media (prefers-color-scheme: dark) {
    article.card {
        background: var(--key-color-20);
        color: var(--key-color-90);
    }
}

article.card.active {
    z-index: 1000;
    box-shadow: 0 0 0 var(--card-outline) var(--ui-primary-100);
}

article.card.hover {
    box-shadow: 0 0 0 var(--card-outline) var(--ui-primary-100);
}

article.card:focus,
article.card.selected {
    outline: initial;
    box-shadow: 0 0 0 var(--card-outline) var(--ui-primary-100);
}

/* article.card :global(a:not(.ui):hover) {

} */
</style>