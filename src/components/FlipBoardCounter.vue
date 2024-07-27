<template>
    <v-container :class="smAndDown ? '' : 'd-flex'">
        <v-tooltip :text="tooltip" location="top" :disabled="!tooltip">
            <template v-slot:activator="{ props }">
                <div v-bind="props" class="d-flex justify-center align-center">
                    <div v-if="title" class="text-caption font-weight-thin text-center" :class="smAndDown ? '' : 'mr-2'">{{ title }}</div>
                    <div ref="tickRef" class="tick d-flex" :style="{ fontSize: `${size}em` }">
                        <div data-repeat="true" data-transform="upper -> split -> delay(random, 10, 15)">
                            <span data-view="flip" data-transform="ascii -> arrive -> round -> char(0-9a-zA-Z)" class="tick-char"></span>
                        </div>
                        <div v-if="magnitude" class="text-caption font-weight-bold" style="position: relative; top: -10px; left: 5px;">{{ magnitude }}</div>
                    </div>
                </div>
            </template>
        </v-tooltip>
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

:deep() .v-overlay__content {
    pointer-events: all;
    cursor: pointer;
}
</style>
<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import Tick from "@pqina/flip"
import "@pqina/flip/dist/flip.min.css"

const magnitude = ref()
const { smAndDown } = useDisplay()
const props = defineProps({
    title: String,
    tooltip: String,
    modelValue: String,
    density: String,
    size: {
        type: Number,
        default: 1,
    }
})
const tickRef = ref()
const mutating = ref({
    tickRef: false
})

const formatedNumberWithMagnitude = computed(() => {
    const number = Number(props.modelValue)

    if (!number) {
        magnitude.value = undefined
        return '000'
    } else if (number < 1000) {
        magnitude.value = undefined
        return number.toString().padStart(3, '0')
    } else if (number < 1_000_000) {
        magnitude.value = 'k'
        return `${Math.floor(number / 1_000)}`.padStart(3, '0')
    } else if (number < 1_000_000_000) {
        magnitude.value = 'm'
        return `${Math.floor(number / 1_000_000)}`.padStart(3, '0')
    } else if (number < 1_000_000_000_000) {
        magnitude.value = 'b'
        return `${Math.floor(number / 1_000_000_000)}`.padStart(3, '0')
    } else {
        magnitude.value = 't'
        return `${Math.floor(number / 1_000_000_000_000)}`.padStart(3, '0')
    }
})

async function animate(tickRef, refName) {
    if (tickRef) return

    mutating.value[refName] = true
    while (mutating.value[refName]) {
        let innerText = tickRef.value.innerText
        await new Promise((resolve) => setTimeout(resolve))
        if (innerText === tickRef.value.innerText) {
            mutating.value[refName] = false
            Array.from(
                document.querySelectorAll("span.tick-flip-spacer")
            ).map((el) => {
                if (el.innerHTML.match(/\s|^$/)) {
                    el.parentElement.style.opacity = 0
                }
            })
        }
    }
}
async function updateUI() {
    Tick.DOM.create(tickRef.value, {
        value: '000',
        credits: false
    })
    Array.from(
        document.querySelectorAll("span.tick-flip-spacer")
    ).forEach((el) => {
        el.parentElement.style.opacity = 1
    })
    const tick = Tick.DOM.find(tickRef.value)
    delete tick.value
    setTimeout(() => {
        tick.value = formatedNumberWithMagnitude.value
        setTimeout(() => animate(tickRef, 'tickRef'))
    })

}
onMounted(() => {
    updateUI()
    watch(() => props.modelValue, updateUI)
})
onUnmounted(() => {
    Tick.DOM.destroy(tickRef.value)
})
</script>