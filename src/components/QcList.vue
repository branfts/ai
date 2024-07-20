<template>
    <v-container fluid :class="smAndDown ? 'pa-0' : ''">
        <div class="d-flex align-center justify-center">
            <div class="text-h6 text-center">{{ user?.username }}</div>
            <v-btn icon="share" variant="text" size="small" @click="dialog = true" :ripple="false" />
        </div>
        <v-list>
            <v-list-item v-for="(link, i) in socialLinks" :key="i" :href="link.href" :title="link.title" :subtitle="link.subtitle" @click="linkClickHandler(link)" @mouseenter="hovered[i] = true" @mouseleave="hovered[i] = false" @focus="hovered[i] = true" @blur="hovered[i] = false" tabindex="0">
                <template v-slot:prepend>
                    <component v-if="link.icon" class="mr-2" :is="link.icon" />
                    <v-img style="border-radius: 25%" v-else :src="link.favicon || link.svg" class="mr-2" width="24" height="24" />
                </template>
                <template v-slot:append>
                    <flip-board ref="flip" class="pa-0" title="Redirecting" v-model="timer" :paused="hovered[i] || dialog" :timeout="link.redirect.timeout" v-if="link.redirect?.timeout && (timer === undefined || timer > -1)" :class="timer < 1 ? 'animate__animated animate__fadeOut' : ''" />
                </template>
            </v-list-item>
        </v-list>
        <v-dialog v-model="dialog" class="d-flex justify-center align-center mx-1" @close="dialog = false" max-width="500" width="100%">
            <v-card rounded="xl" class="my-1 pb-3">
                <v-card-title class="d-flex align-center text-body-1 font-weight-bold">QR Code
                    <v-spacer />
                    <v-icon icon="close" size="x-small" @click="dialog = false"></v-icon>
                </v-card-title>
                <v-divider />
                <v-card-text>
                    <div class="d-flex align-center justify-center" style="width: 250px">
                        <v-img :src="qrcode"></v-img>
                        <v-img src="/ai.logo.svg" width="35" class="qr-logo"></v-img>
                    </div>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                    <v-btn variant="outlined" rounded size="small" @click="downloadHandler">download image</v-btn>
                    <v-btn variant="tonal" rounded size="small" class="mr-4" @click="copyHandler('qrcode')">copy to clipboard
                        <v-tooltip v-model="tooltips['qrcode']" class="justify-center align-center" attach location="top">
                            <span class="text-caption font-weight-bold">Copied</span>
                        </v-tooltip>
                    </v-btn>
                </v-card-actions>
            </v-card>
            <v-card rounded="xl" class="my-1 pb-3">
                <v-card-title class="d-flex align-center text-body-1 font-weight-bold">Binary</v-card-title>
                <v-card-subtitle>
                    {{ binary }}
                </v-card-subtitle>
                <v-card-actions>
                    <v-btn variant="tonal" rounded size="small" @click="copyHandler('binary')" class="mr-4">copy to clipboard
                        <v-tooltip v-model="tooltips['binary']" class="justify-center align-center" attach location="top">
                            <span class="text-caption font-weight-bold">Copied</span>
                        </v-tooltip>
                    </v-btn>
                </v-card-actions>
            </v-card>
            <v-card rounded="xl" class="my-1 pb-3">
                <v-card-title class="d-flex align-center text-body-1 font-weight-bold">Link</v-card-title>
                <v-card-subtitle>
                    {{ qcLink }}
                </v-card-subtitle>
                <v-card-actions>
                    <v-btn variant="tonal" rounded size="small" @click="copyHandler('link')" class="mr-4">copy to clipboard
                        <v-tooltip v-model="tooltips['link']" class="justify-center align-center" attach location="top">
                            <span class="text-caption font-weight-bold">Copied</span>
                        </v-tooltip>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<style scoped>
.qr-logo {
    position: absolute;
    border-radius: 25%;
    background: white;
    opacity: 0.95;
}
</style>
<script setup>
import 'animate.css'
import QRCode from 'qrcode'
import { ref, computed, inject, onMounted, watch } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'

import FlipBoard from '@/components/FlipBoard.vue'

const clipboard = inject('clipboard')
const binary = computed(() => qcLink.value?.split('').map(x => x.charCodeAt(0).toString(2)).join(' '))
const dialog = ref(false)
const { smAndDown } = useDisplay()
const props = defineProps({
    user: Object
})
const tooltips = ref({
    binary: false,
    qrcode: false,
    link: false
})
const links = computed(() => props.user?.links)
const qcLink = computed(() => `${window.location.origin}/u/${props.user.username}`)
const flip = ref()
const timer = ref()
const parseSocialLinks = inject('parseSocialLinks')

const hovered = ref(links.value?.reduce((acc, cur, i) => ({ ...acc, [i]: false }), {}) || {})
const socialLinks = computed(() => parseSocialLinks(links.value))
const qrcode = ref()

// console.log(socialLinks.value)
function copyDataUrlToClipboard(dataUrl) {
    const byteString = atob(dataUrl.split(',')[1])
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }

    clipboard.copy(new Blob([ab], { type: mimeString }))
}

function copyHandler(name) {
    tooltips.value[name] = true
    if (name === 'qrcode') {
        copyDataUrlToClipboard(qrcode.value)
    } else if (name === 'binary') {
        clipboard.copy(binary.value)
    } else if (name === 'link') {
        clipboard.copy(qcLink.value)
    }
    setTimeout(() => tooltips.value[name] = false, 1500)
    gtag('event', 'link_copy', { method: name })
}

function linkClickHandler(link) {
    // Google Analytics 4 event tracking
    const details = {
        owner: user.value.username,
        ...link
    }
    console.log(details)
    gtag('event', 'link_click', details)
}
async function asyncInit() {
    qrcode.value = await QRCode.toDataURL(qcLink.value, { type: 'image/webp' })
}
function downloadHandler() {
    const link = document.createElement('a')
    link.href = qrcode.value
    link.download = `${window.location.hostname}-${props.user.username}.webp`
    link.click()
    gtag('event', 'link_download')
}

asyncInit()
onMounted(() => {
    watch(dialog, dialog => {
        if (!dialog) return
        if (!qrcode.value) {
            asyncInit()
        }
        gtag('event', 'qc_dialog')
    })
    watch(timer, timer => {
        if (timer !== undefined && timer < 0) {
            window.location.href = links.value.find(link => link.redirect).href
        }
    })
})
</script>