<template>
	<v-container fluid :class="smAndDown ? 'pa-0' : ''">
		<v-card flat class="w-100">
			<v-card-title>
				<div class="d-flex align-center justify-center">
					<div class="text-h6 text-center pr-2">{{ user?.username }}</div>
					<v-btn icon="share" ref="tourShareButtonRef" variant="text" size="small" @click="dialogs.share = true" :ripple="false" />
				</div>
			</v-card-title>
			<v-card-subtitle class="pa-0 mt-n4" :class="smAndDown ? 'text-center' : 'text-end'">
				<v-btn ref="tourButtonRef" variant="text" size="small" @click="startTour" icon="info_outline" color="grey-darken-2" />
				<v-btn ref="tourGitButtonRef" class="text-caption" :href="`${repo}/fork`" target="_blank" rel="noopener" text="update this index" :variant="smAndDown ? 'text' : 'outlined'" size="small" :append-icon="GitHubIcon" />
			</v-card-subtitle>
			<v-card-text>
				<flip-board
					ref="flip"
					class="d-flex justify-center pa-0"
					title="Redirecting"
					tooltipLocation="bottom"
					v-model="timer"
					:paused="hovered.flipboard || dialogs.share"
					:timeout="linkRedirectRule.timeout"
					v-if="!route.query.noredirect && linkRedirectRule?.timeout && linkRedirectRule.notIndexed && (timer === undefined || timer > -1)"
					:class="timer < 1 ? 'animate__animated animate__fadeOut' : ''" />
			</v-card-text>
		</v-card>
		<v-list ref="tourListRef" :opened="opened">
			<div v-for="(link, i) in filteredLinks" :key="i">
				<v-list-item v-if="link.group && !groupSubHeaders[`${link.group}`]" type="subheader" :title="groups[link.group].title" class="text-center" :class="{ 'grouped start': link.group }">
					<template v-slot:title="title"
						><span class="text-caption font-weight-light">{{ title.title }}</span></template
					>
				</v-list-item>
				<v-list-item
					:id="`u.${user.username} ${link.uuid}`"
					:href="!editing[link.uuid] ? link.url : undefined"
					:title="link.title || link.url"
					:subtitle="!editing[link.uuid] ? link.subtitle : undefined"
					@mouseenter="hovered[i] = true"
					@mouseleave="hovered[i] = false"
					@focus="hovered[i] = true"
					@blur="hovered[i] = false"
					tabindex="0"
					:class="{ 'pa=0': smAndDown, grouped: link.group, end: filteredLinks[i + 1]?.group !== link.group }">
					<template v-slot:prepend>
						<component v-if="!editing[link.uuid] && link.icon" class="mr-8" :is="link.icon" :style="hovered[i] ? `color: ${typeof link.color === 'function' ? link.color() : link.color}` : 'filter: grayscale(100%)'" />
						<v-img style="border-radius: 25%" v-else-if="(!editing[link.uuid] && link.favicon) || link.svg" :src="link.favicon || link.svg" class="mr-8" width="24" height="24" />
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
						<flip-board
							ref="flip"
							class="pa-0 mr-4"
							title="Redirecting"
							v-model="timer"
							:paused="hovered[i] || dialogs.share"
							:timeout="linkRedirectRule.timeout"
							v-if="!route.query.noredirect && !editing[link.uuid] && linkRedirectRule?.timeout && linkRedirectRule?.url === link.url && (timer === undefined || timer > -1)"
							:class="timer < 1 ? 'animate__animated animate__fadeOut' : ''" />
						<flip-board-counter :ref="`flip-clicks-${i}`" class="pa-0 mr-4 animate__animated animate__fadeIn" :tooltip="`${link.clicks?.toLocaleString()} click${link.clicks > 1 ? 's' : ''}`" :modelValue="`${link.clicks}`" v-if="!editing[link.uuid] && link.clicks" />
						<div v-if="isAuthenticated && !editing[link.uuid]" class="d-flex">
							<v-btn :text="smAndDown ? undefined : 'edit'" :icon="smAndDown ? 'edit' : undefined" variant="tonal" rounded size="small" @click.prevent="editing[link.uuid] = true" />
						</div>
					</template>
					<!-- eslint-disable -->
					<link-field v-if="isAuthenticated && editing[link.uuid]" :key="link.uuid" :link="link" @update="link => (store.form.links[socialLinks.findIndex(l => l.url !== '' && l.url === link.url)] = link)" @delete="editing[link.uuid] = false" />
				</v-list-item>
			</div>
			<v-list-group v-for="subgroup of subgroups" :key="subgroup.name" :value="subgroup.name">
				<template v-slot:activator="{ props, isOpen }">
					<v-list-item v-bind="props" :title="subgroup.name">
						<template v-slot:prepend>
							<component v-if="!editing[`subgroup-${subgroup.name}`] && subgroup.icon" class="mr-8" :is="subgroup.icon" :style="hovered[i] ? `color: ${typeof subgroup.color === 'function' ? subgroup.color() : subgroup.color}` : 'filter: grayscale(100%)'" />
							<v-img style="border-radius: 25%" v-else-if="(!editing[`subgroup-${subgroup.name}`] && subgroup.favicon) || subgroup.svg" :src="subgroup.favicon || subgroup.svg" class="mr-8" width="24" height="24" />
							<v-icon v-else-if="!editing[`subgroup-${subgroup.name}`]" :color="isOpen ? 'amber' : ''" icon="toll" size="24"></v-icon>
						</template>
					</v-list-item>
				</template>

				<v-list-item
					:id="`u.${user.username} ${link.uuid}`"
					v-for="(link, i) in subgroup.links"
					:key="i"
					:href="!/cryptocurrency/.test(subgroup.name) && !editing[link.uuid] ? link.url : undefined"
					:title="link.title || link.url"
					:subtitle="!editing[link.uuid] ? link.subtitle : undefined"
					@mouseenter="hovered[i] = true"
					@mouseleave="hovered[i] = false"
					@focus="hovered[i] = true"
					@blur="hovered[i] = false"
					@click=";/cryptocurrency/.test(subgroup.name) && clickHandler(link)"
					tabindex="0"
					:class="smAndDown ? 'pa-0' : ''">
					<template v-slot:prepend>
						<component v-if="!editing[link.uuid] && link.icon" class="mr-8" :is="link.icon" :style="hovered[i] ? `color: ${typeof link.color === 'function' ? link.color() : link.color}` : 'filter: grayscale(100%)'" />
						<v-img style="border-radius: 25%" v-else-if="(!editing[link.uuid] && link.favicon) || link.svg" :src="link.favicon || link.svg" class="mr-8" width="24" height="24" />
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
						<flip-board
							ref="flip"
							class="pa-0 mr-4"
							title="Redirecting"
							v-model="timer"
							:paused="hovered[i] || dialogs.share"
							:timeout="linkRedirectRule.timeout"
							v-if="!route.query.noredirect && !editing[link.uuid] && linkRedirectRule?.timeout && linkRedirectRule?.url === link.url && (timer === undefined || timer > -1)"
							:class="timer < 1 ? 'animate__animated animate__fadeOut' : ''" />
						<flip-board-counter :ref="`flip-clicks-${i}`" class="pa-0 mr-4 animate__animated animate__fadeIn" :tooltip="`${link.clicks?.toLocaleString()} click${link.clicks > 1 ? 's' : ''}`" :modelValue="`${link.clicks}`" v-if="!editing[link.uuid] && link.clicks" />
						<div v-if="isAuthenticated && !editing[link.uuid]" class="d-flex">
							<v-btn :text="smAndDown ? undefined : 'edit'" :icon="smAndDown ? 'edit' : undefined" variant="tonal" rounded size="small" @click.prevent="editing[link.uuid] = true" />
						</div>
					</template>
					<!-- eslint-disable -->
					<link-field v-if="isAuthenticated && editing[link.uuid]" :key="link.uuid" :link="link" @update="link => (store.form.links[socialLinks.findIndex(l => l.url !== '' && l.url === link.url)] = link)" @delete="editing[link.uuid] = false" />
				</v-list-item>
			</v-list-group>
		</v-list>
		<v-dialog v-model="dialogs.share" class="d-flex justify-center align-center mx-1" @close="dialogs.share = false" max-width="500" width="100%" eager>
			<v-card ref="tourShareQrcodeRef" rounded="xl" class="my-1 pb-3">
				<v-card-title class="d-flex align-center text-body-1 font-weight-bold"
					>QR Code
					<v-spacer />
					<v-icon icon="close" size="x-small" @click="dialogs.share = false"></v-icon>
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
					<v-btn variant="tonal" rounded size="small" class="mr-4" @click="copyHandler('qrcode')"
						>copy to clipboard
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
					<v-btn variant="tonal" rounded size="small" @click="copyHandler('hex')" class="mr-4"
						>copy to clipboard
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
					<v-btn variant="tonal" rounded size="small" @click="copyHandler('link')" class="mr-4"
						>copy to clipboard
						<v-tooltip v-model="tooltips['link']" class="justify-center align-center" attach location="top">
							<span class="text-caption font-weight-bold">Copied</span>
						</v-tooltip>
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="dialogs.cryptocurrency" class="d-flex justify-center align-center mx-1" @close="dialogs.cryptocurrency = false" max-width="500" width="100%" eager>
			<v-card v-if="activeLink" ref="tourCryptocurrencyRef" rounded="xl" class="my-1 pb-3">
				<v-card-title class="d-flex align-center text-body-1 font-weight-bold">
					{{ activeLink.title }}
					<v-spacer />
					<v-icon icon="close" size="x-small" @click="dialogs.cryptocurrency = false"></v-icon>
				</v-card-title>
				<v-divider />
				<v-card-text class="d-flex flex-column align-center">
					<v-img width="300" :src="activeLink.url"></v-img>
					<v-chip class="mt-2" color="primary" @click="copyHandler('walletAddress', activeLink.decoded.data)" v-if="activeLink.decoded?.data"
						><div class="text-truncate text-no-wrap text-caption">{{ activeLink.decoded.data }}</div>
						<v-tooltip v-model="tooltips['walletAddress']" class="justify-center align-center" attach location="top" style="opacity: 0.8">
							<span class="text-caption font-weight-bold">Copied</span>
						</v-tooltip>
					</v-chip>
				</v-card-text>
				<v-divider />
				<v-card-actions>
					<v-btn variant="outlined" rounded size="small" @click="downloadHandler">download image</v-btn>
					<v-btn variant="tonal" rounded size="small" class="mr-4" @click="copyHandler('qrcode')"
						>copy image
						<v-tooltip v-model="tooltips['qrcode']" class="justify-center align-center" attach location="top">
							<span class="text-caption font-weight-bold">Copied</span>
						</v-tooltip>
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>
<style scoped>
.grouped {
	background-color: #fafafa;
}
.grouped.start {
	border-radius: 15px 15px 0 0 !important;
}
.grouped.end {
	border-radius: 0 0 15px 15px !important;
}
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
import jsQR from 'jsqr'
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

const activeLink = ref()
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
const opened = ref([])
const editing = ref({})
const analytics = ref()
const clipboard = inject('clipboard')
const { $api, $keycloak, $getRepoForName } = getCurrentInstance().appContext.config.globalProperties
const hex = computed(() =>
	qcLink.value
		?.split('')
		.map(x => x.charCodeAt(0).toString(16))
		.join('')
)
const { smAndDown } = useDisplay()
const store = useAppStore()
const props = defineProps({
	user: Object,
	auth: Object,
})
const tooltips = ref({
	hex: false,
	qrcode: false,
	link: false,
	walletAddress: false,
})
const links = computed(() => props.user?.links)
const rules = computed(() => props.user?.rules)
const qcLink = computed(() => `${window.location.origin}/u/${props.user.username}`)
const flip = ref()
const timer = ref()
const groupSubHeaders = ref({})
const parseSocialLinks = inject('parseSocialLinks')
const isAuthenticated = ref(false)
const linkRedirectRule = computed(() => {
	const { referrer } = route.query

	// Filter rules based on referrer if it exists, otherwise use all rules
	const filteredRules = referrer ? [...rules.value.filter(rule => rule.name === 'redirect' && rule.referrer === referrer)] : rules.value.filter(rule => rule.name === 'redirect' && !rule.referrer)

	// Find the rule with the lowest priority
	const lowestPriorityRedirectRule = filteredRules.reduce((lowest, current) => {
		if (lowest === null || current.priority === lowest.priority) {
			return Math.random() < 0.5 ? current : lowest
		} else if (lowest === null || current.priority < lowest.priority) {
			return current
		} else {
			return lowest
		}
	}, null)

	// Return the rule with the lowest priority or undefined if no rule is found

	return {
		...lowestPriorityRedirectRule,
		notIndexed: !links.value.find(link => link.url === lowestPriorityRedirectRule?.url),
	}
})
const dialogs = ref({
	share: false,
	cryptocurrency: false,
})
const hovered = ref(links.value?.reduce((acc, cur, i) => ({ ...acc, [i]: false }), { flipboard: false }) || { flipboard: false })
const socialLinks = computed(() =>
	parseSocialLinks(links.value)
		?.map(link => {
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
		})
		.sort((a, b) => (!a?.clicks || a.clicks < b.clicks ? 1 : -1))
)
const filteredLinks = computed(() => socialLinks.value.filter(link => !link.subgroup))
const subgroups = computed(() =>
	props.user?.subgroups?.map(subgroup => {
		if (!opened.value.includes(subgroup.name) && (subgroup.open || subgroup.open === undefined)) {
			opened.value = [...opened.value, subgroup.name]
		}
		editing.value[`subgroup-${subgroup.name}`] = false
		return {
			...subgroup,
			links: socialLinks.value.filter(link => link.subgroup === subgroup.name),
		}
	})
)
const groups = computed(() =>
	props.user?.groups?.reduce((groups, group) => {
		groupSubHeaders.value[group.name] = false
		return {
			...groups,
			[group.name]: group,
		}
	}, {})
)
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

function copyHandler(name, value) {
	tooltips.value[name] = true
	if (name === 'qrcode') {
		copyDataUrlToClipboard(qrcode.value)
	} else if (name === 'hex') {
		clipboard.copy(hex.value)
	} else if (name === 'link') {
		clipboard.copy(qcLink.value)
	} else if (value) {
        tooltips.value[name] = true
		clipboard.copy(value)
        setTimeout(() => (tooltips.value[name] = false), 1500)
	}
	setTimeout(() => (tooltips.value[name] = false), 1500)
	gtag('event', 'link_copy', { method: name })
}

async function asyncInit() {
	qrcode.value = await QRCode.toDataURL(qcLink.value, { type: 'image/webp' })
	await $keycloak.value.isLoaded
	if ($keycloak.value.isAuthenticated) {
		isAuthenticated.value = $keycloak.value.isAuthenticated
		nextTick(async () => (analytics.value = await $api.analytics(props.auth, props.user.username)))
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
function clickHandler(link) {
	activeLink.value = link
	if (/cryptocurrency/.test(link.subgroup)) {
		loadImageData(link.url).then(({ data, width, height }) => {
			activeLink.value.decoded = jsQR(data, width, height)
		})
		dialogs.value.cryptocurrency = true
	}
}
async function loadImageData(url) {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.crossOrigin = 'Anonymous' // Handle cross-origin issues

		image.onload = function () {
			const canvas = document.createElement('canvas')
			canvas.width = image.width
			canvas.height = image.height

			const context = canvas.getContext('2d')
			context.drawImage(image, 0, 0)

			const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
			resolve({ data: imageData.data, width: canvas.width, height: canvas.height }) // Uint8ClampedArray
		}

		image.onerror = function (err) {
			reject(err)
		}

		image.src = url
	})
}
asyncInit()
onMounted(() => {
	tour.value = tourInit(refs, smAndDown, offset, dialogs.value.share, (!store.tour.completed && !store.tour.canceled) || (!store.tour.completed && !store.tour.canceled && route.query.tour))
	tour.value
		.on('complete', () => {
			store.tour.completed = Date.now()
			gtag('event', 'qc_tour_complete')
		})
		.on('cancel', () => {
			store.tour.canceled = Date.now()
			gtag('event', 'qc_tour_canceled')
		})
	watch(dialogs.value.share, dialog => {
		if (!dialog) return
		if (!qrcode.value) {
			asyncInit()
		}
		gtag('event', 'qc_dialog')
	})
	watch(timer, timer => {
		if (timer !== undefined && timer < 0) {
			window.location.href = linkRedirectRule.value.url
		}
	})
})
</script>
