<template>
    <v-container fluid :class="smAndDown ? 'pa-0' : ''">
        <v-card flat class="w-100">
            <v-card-title>
                <div class="d-flex align-center justify-center">
                    <div class="text-h6 text-center pr-2">{{ user?.username }}</div>
                    <v-btn icon="share" ref="tourShareButtonRef" variant="text" size="small" @click="dialog = true" :ripple="false" />
                </div>
            </v-card-title>
            <v-card-subtitle class="pa-0 mt-n4" :class="smAndDown ? 'text-center' : 'text-end'">
                <v-btn ref="tourButtonRef" variant="text" size="small" @click="startTour" icon="info_outline" color="grey-darken-2" />
                <v-btn ref="tourGitButtonRef" class="text-caption" :href="`${repo}/fork`" target="_blank" rel="noopener" text="update this index" :variant="smAndDown ? 'text' : 'outlined'" size="small" :append-icon="GitHubIcon" />
            </v-card-subtitle>
        </v-card>
        <v-list ref="tourListRef">
            <v-list-item :id="`u.${user.username} ${link.uuid}`" v-for="(link, i) in socialLinks" :key="i" :href="!editing[link.uuid] ? link.url : undefined" :title="link.title || link.url" :subtitle="!editing[link.uuid] ? link.subtitle : undefined" @mouseenter="hovered[i] = true" @mouseleave="hovered[i] = false" @focus="hovered[i] = true" @blur="hovered[i] = false" tabindex="0" :class="smAndDown ? 'pa-0' : ''">
                <template v-slot:prepend>
                    <component v-if="!editing[link.uuid] && link.icon" class="mr-8" :is="link.icon" :style="hovered[i] ? `color: ${typeof link.color === 'function' ? link.color() : link.color}` : 'filter: grayscale(100%)'" />
                    <v-img style="border-radius: 25%" v-else-if="!editing[link.uuid] && link.favicon" :src="link.favicon || link.svg" class="mr-8" width="24" height="24" />
                    <v-icon v-else-if="!editing[link.uuid] && /mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\?[a-zA-Z0-9=&%+-]*)?/.test(link.url)" icon="mail" size="24"></v-icon>
                    <v-icon v-else-if="!editing[link.uuid]" icon="link" size="24"></v-icon>
                </template>
                <template v-slot:title="{ title }">
                    <div v-if="!editing[link.uuid]" :class="smAndDown ? 'text-body-2' : ''">{{ title.replace(/https:\/\//, '') }}</div>
                </template>
                <template v-slot:subtitle="{ subtitle }">
                    <div class="mb-1" v-if="!editing[link.uuid]" :class="smAndDown ? 'text-body-2' : ''">{{ subtitle }}</div>
                </template>
                <template v-slot:append>
                    <flip-board ref="flip" class="pa-0 mr-4" title="Redirecting" v-model="timer" :paused="hovered[i] || dialog" :timeout="link.redirect.timeout" v-if="!editing[link.uuid] && link.redirect?.timeout && (timer === undefined || timer > -1)" :class="timer < 1 ? 'animate__animated animate__fadeOut' : ''" />
                    <flip-board-counter :ref="`flip-clicks-${i}`" class="pa-0 mr-4 animate__animated animate__fadeIn" :tooltip="`${link.clicks?.toLocaleString()} click${link.clicks > 1 ? 's' : ''}`" :modelValue="link.clicks" v-if="!editing[link.uuid] && link.clicks" />
                    <div v-if="isAuthenticated && !editing[link.uuid]" class="d-flex">
                        <v-btn :text="smAndDown ? undefined : 'edit'" :icon="smAndDown ? 'edit' : undefined" variant="tonal" rounded size="small" @click.prevent="editing[link.uuid] = true" />
                    </div>
                </template>
                <!-- eslint-disable -->
                <link-field v-if="isAuthenticated && editing[link.uuid]" :key="link.uuid" :link="link" @update="link => store.form.links[socialLinks.findIndex(l => l.url !== '' && l.url === link.url)] = link" @delete="editing[link.uuid] = false" />
            </v-list-item>
        </v-list>
        <v-dialog v-model="dialog" class="d-flex justify-center align-center mx-1" @close="dialog = false" max-width="500" width="100%" eager>
            <v-card ref="tourShareQrcodeRef" rounded="xl" class="my-1 pb-3">
                <v-card-title class="d-flex align-center text-body-1 font-weight-bold">QR Code
                    <v-spacer />
                    <v-icon icon="close" size="x-small" @click="dialog = false"></v-icon>
                </v-card-title>
                <v-divider />
                <v-card-text class="py-0">
                    <div class="d-flex align-center justify-center" style="width: 200px">
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
            <v-card ref="tourShareHexRef" rounded="xl" class="my-1 pb-3">
                <v-card-title class="d-flex align-center text-body-1 font-weight-bold">Hex</v-card-title>
                <v-card-subtitle>
                    {{ hex }}
                </v-card-subtitle>
                <v-card-actions>
                    <v-btn variant="tonal" rounded size="small" @click="copyHandler('hex')" class="mr-4">copy to clipboard
                        <v-tooltip v-model="tooltips['hex']" class="justify-center align-center" attach location="top">
                            <span class="text-caption font-weight-bold">Copied</span>
                        </v-tooltip>
                    </v-btn>
                </v-card-actions>
            </v-card>
            <v-card ref="tourShareUrlRef" rounded="xl" class="my-1 pb-3">
                <v-card-title class="d-flex align-center text-body-1 font-weight-bold">URL</v-card-title>
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
import { ref, computed, inject, onMounted, watch, getCurrentInstance, nextTick } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { GitHubIcon } from 'vue3-simple-icons'
import { v5 as uuidv5 } from 'uuid'
import { offset } from '@floating-ui/dom'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/app'

import FlipBoard from '@/components/FlipBoard.vue'
import FlipBoardCounter from '@/components/FlipBoardCounter.vue'
import LinkField from './LinkField.vue'
import { tourInit } from '@/utils/tour.utils.js'

const route = useRoute()
const tour = ref()
const tourButtonRef = ref()
const tourListRef = ref()
const tourGitButtonRef = ref()
const tourShareButtonRef = ref()
const tourShareQrcodeRef = ref()
const tourShareHexRef = ref()
const tourShareUrlRef = ref()
const refs = {
    'tour-list': { index: 20, ref: tourListRef },
    'tour-git-button': { index: 30, ref: tourGitButtonRef },
    'tour-share-button': { index: 40, ref: tourShareButtonRef },
    'tour-share-qrcode': { index: 50, ref: tourShareQrcodeRef },
    'tour-share-hex': { index: 60, ref: tourShareHexRef },
    'tour-share-url': { index: 70, ref: tourShareUrlRef },
    'tour-button': { index: 100, ref: tourButtonRef },
}
const editing = ref({})
const analytics = ref()
const clipboard = inject('clipboard')
const { $api, $keycloak, $getRepoForName } = getCurrentInstance().appContext.config.globalProperties
const hex = computed(() => qcLink.value?.split('').map(x => x.charCodeAt(0).toString(16)).join(''))
const dialog = ref(false)
const { smAndDown } = useDisplay()
const store = useAppStore()
const props = defineProps({
    user: Object,
    auth: Object
})
const tooltips = ref({
    hex: false,
    qrcode: false,
    link: false
})
const links = computed(() => props.user?.links)
const qcLink = computed(() => `${window.location.origin}/u/${props.user.username}`)
const flip = ref()
const timer = ref()
const parseSocialLinks = inject('parseSocialLinks')
const isAuthenticated = ref(false)

const hovered = ref(links.value?.reduce((acc, cur, i) => ({ ...acc, [i]: false }), {}) || {})
const socialLinks = computed(() => parseSocialLinks(links.value)?.map(link => {
    // hack fix for old syntax
    link.href && !link.url && (link.url = link.href)
    if (!analytics.value) return link
    link.uuid = uuidv5(link.url, uuidv5.URL)
    editing.value[link.uuid] = false
    const matchingLinkClickAnalytics = analytics.value?.linkClicks && Object.entries(analytics.value.linkClicks).find(([key, value]) => link.uuid.includes(key))?.[1]

    if (matchingLinkClickAnalytics) {
        link.clicks = Number(matchingLinkClickAnalytics.count)
    }
    return link
}).sort((a, b) => !a?.clicks || a.clicks < b.clicks ? 1 : -1))
const qrcode = ref()
const repo = $getRepoForName(props.user.username)

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
    } else if (name === 'hex') {
        clipboard.copy(hex.value)
    } else if (name === 'link') {
        clipboard.copy(qcLink.value)
    }
    setTimeout(() => tooltips.value[name] = false, 1500)
    gtag('event', 'link_copy', { method: name })
}

async function asyncInit() {
    qrcode.value = await QRCode.toDataURL(qcLink.value, { type: 'image/webp' })
    await $keycloak.value.isLoaded
    if ($keycloak.value.isAuthenticated) {
        isAuthenticated.value = $keycloak.value.isAuthenticated
        nextTick(async () => analytics.value = await $api.analytics(props.auth, props.user.username))
    }
}
function downloadHandler() {
    const link = document.createElement('a')
    link.href = qrcode.value
    link.download = `${window.location.hostname}-${props.user.username}.webp`
    link.click()
    gtag('event', 'link_download')
}
function startTour() {
    store.tour.completed = false
    store.tour.canceled = false
    store.tour.started = Date.now()
    tour.value.start()
    gtag('event', 'qc_tour_start')
}

asyncInit()
onMounted(() => {
    tour.value = tourInit(refs, smAndDown, offset, dialog, !store.tour.completed && !store.tour.canceled || (!store.tour.completed && !store.tour.canceled && route.query.tour))
    tour.value.on('complete', () => {
        store.tour.completed = Date.now()
        gtag('event', 'qc_tour_complete')
    })
        .on('cancel', () => {
            store.tour.canceled = Date.now()
            gtag('event', 'qc_tour_canceled')
        })
    watch(dialog, dialog => {
        if (!dialog) return
        if (!qrcode.value) {
            asyncInit()
        }
        gtag('event', 'qc_dialog')
    })
    watch(timer, timer => {
        if (timer !== undefined && timer < 0) {
            window.location.href = socialLinks.value.find(link => link.redirect).url
        }
    })
})
</script>