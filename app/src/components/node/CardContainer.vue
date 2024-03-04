<script setup lang="ts">
import { type PropType } from 'vue'
import type { Node } from 'nodenoggin/schema'
import { getCardStyle } from 'nodenoggin/app'

defineProps({
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
    <article v-bind="$attrs" :class="{
        card: true,
        active,
        selected,
        hover,
        spatial: !!transform,
        ui: true,
    }" :style="getCardStyle(color, transform)">
        <slot></slot>
    </article>
</template>

<style scoped>
article.card {
    color: var(--ui-10);
    background: var(--key-color-90);
    border-radius: var(--ui-radius);
    box-shadow: 0 0 0 var(--card-outline) hsla(var(--mono-base-hue), 8%, 20%, 0.15);
    opacity: 0.0;
    animation: fadeIn 1.25s 0.5s forwards;
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
        box-shadow: 0 0 0 var(--card-outline) hsla(var(--mono-base-hue), 8%, 90%, 0.15);
    }
}

article.card.active {
    z-index: 1000;
    box-shadow: 0 0 0 calc(var(--card-outline) * 2) var(--ui-primary-100);
    pointer-events: initial;
}

article.card.hover {
    box-shadow: 0 0 0 calc(var(--card-outline) * 2) var(--ui-primary-100);
}

/* article.card:focus, */
article.card.selected {
    outline: initial;
    box-shadow: 0 0 0 calc(var(--card-outline) * 2) var(--ui-primary-100);
}
</style>