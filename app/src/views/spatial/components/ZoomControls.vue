<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'radix-vue'
import { computed, type PropType } from 'vue';
import { ZOOM_INCREMENT, MIN_ZOOM, MAX_ZOOM } from '../constants';

const props = defineProps({
    value: {
        type: Number,
        required: true
    },
    min: {
        type: Number,
        default: MIN_ZOOM
    },
    max: {
        type: Number,
        default: MAX_ZOOM
    },
    label: {
        type: String,
        required: true
    },
    onChange: {
        type: Function as PropType<(n: number) => void>,
        required: true
    },
    step: {
        type: Number,
        default: ZOOM_INCREMENT
    }
})

const handleChange = (n?: number[]) => {
    if (n) {
        props.onChange(n[0])
    }
}
const value = computed(() => [props.value])
</script>
<template>
    <SliderRoot @update:modelValue="handleChange" :model-value="value" class="SliderRoot" :max="props.max" :min="props.min"
        orientation="vertical" :step="props.step">
        <SliderTrack class="SliderTrack">
            <SliderRange class="SliderRange">
                <!-- <span>{{ value }}</span> -->
            </SliderRange>
        </SliderTrack>
        <SliderThumb class="SliderThumb" :aria-label="props.label" />
    </SliderRoot>
</template>

<style>
.SliderRoot {
    position: absolute;
    background: white;
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    /* user-select: none; */
    touch-action: none;
    z-index: 50000;
    padding: 15px;
    bottom: 150px;
    right: 10px;
    border-radius: 10px;
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);

}

.SliderRoot[data-orientation="vertical"] {
    flex-direction: column;
    height: 200px;
}

.SliderTrack {
    background: rgba(200, 200, 200, 1.0);
    position: relative;
    flex-grow: 1;
    border-radius: 9999px;
    height: 3px;
}


.SliderTrack[data-orientation="vertical"] {
    width: 3px;
}

.SliderRange[data-orientation="vertical"] {
    width: 100%;
}


.SliderThumb {
    display: block;
    width: 20px;
    height: 20px;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
}

/* .SliderThumb:hover {
    background-color: var(--grass-3);
}

.SliderThumb:focus {
    outline: none;
    box-shadow: 0 0 0 5px var(--black-a8);
} */
</style>
