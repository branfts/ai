<template>
    <v-container>
        <div v-if="title" class="text-caption font-weight-thin text-center">{{ title }}</div>
        <div class="d-flex justify-center align-center">
            <div v-show="!reset" ref="tickRef" class="tick" :style="{ fontSize: `${size}em` }">
                <div data-repeat="true">
                    <span data-view="flip" class="tick-char"></span>
                </div>
            </div>
        </div>
    </v-container>
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
</style>
<script setup>
import { watch, ref, onMounted, onUnmounted } from 'vue'
import Tick from "@pqina/flip"
import "@pqina/flip/dist/flip.min.css"

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
        if (!props.paused) {
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