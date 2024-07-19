<template>
    <v-tooltip :text="hardPaused ? 'Resume' : 'Pause'" location="left" close-delay="2500" @click.prevent="hardPaused = !hardPaused">
        <template v-slot:activator="{ props: tooltip }">
            <v-container v-bind="{ ...$attrs, ...tooltip }" :class="smAndDown ? '' : 'd-flex'">
                <div v-if="title" class="text-caption font-weight-thin text-center" :class="smAndDown ? '' : 'mr-2'">{{ hardPaused ? 'paused' : title }}</div>
                <div class="d-flex justify-center align-center">
                    <div v-show="!reset" ref="tickRef" class="tick" :style="{ fontSize: `${size}em` }">
                        <div data-repeat="true">
                            <span data-view="flip" class="tick-char"></span>
                        </div>
                    </div>
                </div>
            </v-container>
        </template>
    </v-tooltip>
</template>
<style scoped>
.tick-char {
    width: 1em;
}

body {
    background-color: rgb(255, 255, 255) !important;
}

.smAndDown {
    display: flex !important;
    flex-wrap: wrap !important;
}

:deep() .v-overlay__content {
    pointer-events: all;
    cursor: pointer;
}
</style>
<script setup>
import { watch, ref, onMounted, onUnmounted } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import Tick from "@pqina/flip"
import "@pqina/flip/dist/flip.min.css"

const { smAndDown } = useDisplay()
const hardPaused = ref(false)
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: Number,
    title: String,
    reset: Boolean,
    density: String,
    timeout: Number,
    paused: Boolean,
    size: {
        type: Number,
        default: 1,
    }
})
const tickRef = ref()
async function updateUI() {
    if (!props.timeout) return

    Tick.DOM.create(tickRef.value, {
        value: Number(props.timeout),
        credits: false
    })
    Array.from(
        document.querySelectorAll("span.tick-flip-spacer")
    ).forEach((el) => {
        el.parentElement.style.opacity = 1
    })
    const tick = Tick.DOM.find(tickRef.value)
    delete tick.value
    Tick.helper.interval(function () {

        // For this demo we increase
        // the value of our ticker
        // each second
        if (!hardPaused.value && !props.paused) {
            tick.value--
        }
        emit('update:modelValue', tick.value)
    }, 1000)
}
onMounted(() => {
    updateUI()
    watch(() => props.timeout, updateUI)
})
onUnmounted(() => {
    Tick.DOM.destroy(tickRef.value)
})
</script>