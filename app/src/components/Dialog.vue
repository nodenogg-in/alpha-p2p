<script setup lang="ts">
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogDescription,
    AlertDialogPortal,
    AlertDialogRoot,
    AlertDialogTitle,
    AlertDialogTrigger,
} from 'radix-vue'
import Button from './Button.vue';


const props = defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    onConfirm: {
        type: Function,
        required: true
    }
})
</script>

<template>
    <AlertDialogRoot>
        <AlertDialogTrigger as-child>
            <slot></slot>
        </AlertDialogTrigger>
        <AlertDialogPortal>
            <AlertDialogOverlay class="overlay" />
            <AlertDialogContent class="content">
                <AlertDialogTitle class="title">
                    {{ props.title }}
                </AlertDialogTitle>
                <AlertDialogDescription v-if="props.description" class="description">
                    {{ props.description }}
                </AlertDialogDescription>
                <div class="tray">
                    <AlertDialogCancel as-child>
                        <Button>
                            Cancel
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction as-child @click="props.onConfirm">
                        <Button>
                            Confirm
                        </Button>
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialogPortal>
    </AlertDialogRoot>
</template>

<style>
.overlay {
    background-color: hsla(var(--mono-base-hue), 8%, 10%, 0.5);
    position: fixed;
    inset: 0;
    z-index: 999;
    animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.content {
    background-color: white;
    border-radius: 6px;
    box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90vw;
    max-width: 500px;
    max-height: 85vh;
    padding: 25px;
    z-index: 1000;
    animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.content:focus {
    outline: none;
}

.title {
    margin: 0;
    color: var(--mauve-12);
    font-size: 17px;
    font-weight: 500;
}

.description {
    margin-bottom: 20px;
    color: var(--mauve-11);
    font-size: 15px;
    line-height: 1.5;
}

.tray {
    display: flex;
    gap: 25;
    justify-content: flex-end;
}

@keyframes overlayShow {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes contentShow {
    from {
        opacity: 0;
        transform: translate(-50%, -48%) scale(0.96);
    }

    to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}
</style>