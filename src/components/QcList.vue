<template>
    <v-container fluid>
        <v-list>
            <v-list-item v-for="link in links" :key="link.href" :href="link.href" :title="link.title" :subtitle="link.subtitle" @click="linkClickHandler(link)">
                <template v-slot:prepend>
                    <component v-if="link.icon" class="mr-2" :is="link.icon" />
                    <img v-else :src="link.svg" class="mr-2" width="24" height="24" />
                </template>
            </v-list-item>
        </v-list>
    </v-container>
</template>
<style scoped></style>
<script setup>
import { ref, computed, inject } from 'vue'

const parseSocialLinks = inject('parseSocialLinks')
const links = computed(() => parseSocialLinks([
    {
        "href": "https://beacons.ai/astarbabyxo",
        "title": "Beacons.ai",
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
]))
console.log(links)
function linkClickHandler (link) {
    // Google Analytics 4 event tracking
    gtag('event', 'click', {
        event_category: 'link',
        ...link
    })
}
</script>