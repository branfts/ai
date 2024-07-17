<template>
    <v-container fluid>
        <v-list>
            <v-list-item v-for="(link, i) in links" :key="i" :href="link.href" :title="link.title" :subtitle="link.subtitle" @click="linkClickHandler(link)" @mouseenter="hovered[i] = true" @mouseleave="hovered[i] = false" @focus="hovered[i] = true" @blur="hovered[i] = false" tabindex="0">
                <template v-slot:prepend>
                    <component v-if="link.icon" class="mr-2" :is="link.icon" />
                    <img v-else :src="link.svg" class="mr-2" width="24" height="24" />
                </template>
                <template v-slot:append>
                    <flip-board ref="flip" class="pa-0" title="Redirecting" v-model="timer" :paused="hovered[i]" :timeout="link.rules.redirect.timeout" v-if="link.rules?.redirect?.timeout && (timer === undefined || timer > -1)" :class="timer < 1 ? 'animate__animated animate__fadeOut' : ''" />
                </template>
            </v-list-item>
        </v-list>
    </v-container>
</template>
<style scoped></style>
<script setup>
import 'animate.css'
import { ref, computed, inject, onMounted, watch } from 'vue'
import { useAppStore } from '@/store/app'

import FlipBoard from '@/components/FlipBoard.vue'

const flip = ref()
const timer = ref()
const store = useAppStore()
const parseSocialLinks = inject('parseSocialLinks')
const rules = {
    redirect: {
        timeout: 3
    }
}
const rawLinks = [
    {
        "href": "https://beacons.ai/astarbabyxo",
        "title": "Beacons.ai",
        rules
    },
    {
        "href": "https://onlyfans.com/astarbabyxo",
        "title": "Exclusive Content 😘",
        "subtitle": "Only place I reply to DMS☺️🫶🏻"
    },
    {
        "href": "https://www.instagram.com/astarxobaby?igsh=MTJ1c3pwNHo0M3V4ag%3D%3D&utm_source=qr",
        "title": "New Insta✨",
        "subtitle": "I post here daily🥰"
    },
    {
        "href": "https://instagram.com/astarbabyxox?igshid=ZWIzMWE5ZmU3Zg==",
        "title": "Instagram ",
        "subtitle": "My main account ☺️"
    },
    {
        "href": "https://www.instagram.com/astarbabyxo/",
        "title": "Backup Instagram",
        "subtitle": ""
    },
    {
        "href": "https://instagram.com/astarbabyxx?igshid=NTc4MTIwNjQ2YQ==",
        "title": "Reels +vids Insta ",
        "subtitle": "AstarbabyXxtra"
    },
    {
        "href": "https://throne.com/astarbabyxo",
        "title": "Wishlist!✨",
        "subtitle": "Spoil me🥺❤️"
    },
    {
        "href": "https://www.tiktok.com/@xastarbabyx?_t=8lAY0KRkaa9&_r=1",
        "title": "Main Tik Tok",
        "subtitle": ""
    },
    {
        "href": "https://www.tiktok.com/@aastarbabyxo?_t=8lAY5nrBf9g&_r=1",
        "title": "2nd Tik Tok",
        "subtitle": ""
    },
    {
        "href": "https://www.tiktok.com/@itsastarbaby?_t=8jQxhyYTvfz&_r=1",
        "title": "Vlog Tik Tok",
        "subtitle": ""
    },
    {
        "href": "https://www.threads.net/@astarbabyxo",
        "title": "Threads ",
        "subtitle": "My thoughts 💭 "
    },
    {
        "href": "https://www.facebook.com/profile.php?id=100063889657411&mibextid=LQQJ4d",
        "title": "ONLY Facebook",
        "subtitle": "I don’t msg on here, I only post💙✨"
    },
    {
        "href": "https://www.facebook.com/profile.php?id=100063889657411&mibextid=LQQJ4d",
        "title": "Facebook",
        "subtitle": "I don’t msg on here, I only post💙✨"
    }
]
const hovered = ref(rawLinks.reduce((acc, cur, i) => ({ ...acc, [i]: false }), {}))
const links = computed(() => parseSocialLinks(rawLinks))
console.log(links)
function linkClickHandler(link) {
    // Google Analytics 4 event tracking
    const details = {
        owner: 'astarbabyxo',
        ...link
    }
    console.log(details)
    gtag('event', 'link_click', details)
}
onMounted(() => {
    watch(timer, timer => {
        if (timer !== undefined && timer < 0) {
            const href = links.value.find(link => link.rules)?.href
            if (!href) return

            window.location.href = href
        }
    })
})
</script>