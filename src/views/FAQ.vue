<template>
    <v-container class="h-100 d-flex align-center justify-center flex-column" :class="smAndDown ? 'px-1' : ''" fluid :style="smAndDown ? 'margin-top: 50px' : 'margin-top: 200px'">
        <span class="mb-4" :class="smAndDown ? 'text-h4' : 'text-h2'">{{ smAndDown ? 'F.A.Q.' : 'Frequently Asked Questions' }}</span>
        <v-responsive :width="smAndDown ? '100%' : '80%'" max-width="1200" class="mx-auto">
            <v-container class="mb-8" :class="smAndDown ? 'pa-0' : ''">
                <v-breadcrumbs :items="categoryBreadcrumbs" class="justify-center mb-6 pa-0" color="green-lighten-2">
                    <template v-slot:divider>
                        <v-icon icon="chevron_right"></v-icon>
                    </template>
                </v-breadcrumbs>
                <v-row justify="center">
                    <v-col>
                        <v-expansion-panels v-model="store.faq.category" accordian inset density="compact">
                            <v-expansion-panel v-for="(categoryFaqs, categoryName) in faqs" :key="categoryName" rounded="xl" bg-color="green-lighten-2">
                                <!-- category -->
                                <v-expansion-panel-title :class="smAndDown ? 'text-h4' : 'text-h2'">{{ categoryName.charAt(0).toUpperCase() + categoryName.slice(1) }}</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-expansion-panels v-model="store.faq.question" accordian inset>
                                        <v-expansion-panel v-for="(faq, index) in categoryFaqs" :key="faq.id" rounded="xl">
                                            <!-- question -->
                                            <v-expansion-panel-title>
                                                <div class="d-flex align-center" :style="store.faq.question === index ? 'font-size: larger' : ''" v-bind:class="questionHeaderClass(store.faq.question === index)">
                                                    <span class="text-h6 text-green-darken-4">{{ faq.question }}</span>
                                                    <div class="ml-4" v-if="store.faq.question === index">

                                                        <v-tooltip text="Copied Link" v-model="tooltip" :target="`#answer-${faq.id}`">
                                                            <template v-slot:activator="{ props }">
                                                                <a v-bind="props" :href="`${origin}/faq?category=${encodeURIComponent(categoryName)}&id=${faq.id}`" @mouseenter="copyHandler(`${origin}/faq?category=${encodeURIComponent(categoryName)}&id=${faq.id}`, faq.id)" title="QC FAQ">
                                                                    <v-icon icon="content_copy" />
                                                                </a>
                                                            </template>
                                                        </v-tooltip>
                                                    </div>
                                                </div>
                                            </v-expansion-panel-title>
                                            <v-expansion-panel-text v-bind:class="{ mobileFont: smAndDown }" class="px-6">
                                                <v-img max-height="300" class="mb-4" v-if="faq.image" :src="faq.image"></v-img>
                                                <div class="faq-answer" v-html="faq.answer"></div>
                                            </v-expansion-panel-text>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="pt-1">
                        <v-expansion-panels model-value="0" density="compact" readonly>
                            <v-expansion-panel rounded="xl" bg-color="green-lighten-2">
                                <v-expansion-panel-title collapse-icon="contact_support" :class="smAndDown ? 'text-h4' : 'text-h2'">Ask</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-card rounded="xl">
                                        <v-card-title>Don't see your question answegreen here?</v-card-title>
                                        <v-card-subtitle>Check our informative blog articles, or GitHub issues, or use our contact email for even more assistance if needed.</v-card-subtitle>
                                        <v-card-text class="ml-8">
                                            <ul>
                                                <li><a href="https://github.com/june07/qc/issues" target="_blank" rel="noopener">GitHub Issues</a></li>
                                                <li><a href="mailto:support@june07.com?subject=QC Support" target="_blank" rel="noopener">Email Support</a></li>
                                            </ul>
                                        </v-card-text>
                                    </v-card>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-col>
                </v-row>
            </v-container>
        </v-responsive>
        <v-container v-if="!smAndDown" fluid style="background-color: green-lighten-2; min-height: 500px"></v-container>
        <v-spacer />
    </v-container>
</template>
<style>
video {
    border-radius: 8px;
}

.kg-video-overlay {
    display: none;
}

figcaption {
    margin-bottom: 24px;
    color: gray;
    font-style: italic;
    text-align: center;
}

.faq-answer {
    font-size: larger;
}

.faq-answer img {
    max-height: 600px;
    width: auto;
}

table {
    margin: 20px auto;
}

td {
    padding: 0 20px 0 20px;
}

td:nth-child(2) {
    background: #ffebee;
}

td:nth-child(3) {
    background: #fafafa;
}

blockquote {
    font-family: 'Times New Roman', Times, serif;
    font-size: x-large;
    background: #f9f9f9;
    border-left: 10px solid #ccc;
    margin: 0.5em 10px;
    padding: 0 10px;
    quotes: '"\201C" "\201D" "\2018" "\2019"';
    padding: 10px 20px;
    line-height: 1.4;
}

blockquote:before {
    content: open-quote;
    display: inline;
    height: 0;
    line-height: 0;
    left: -10px;
    position: relative;
    top: 30px;
    color: #ccc;
    font-size: 3em;
}

p {
    margin-bottom: 24px;
}
</style>

<script setup>
import { map } from 'async'
import { ref, computed, onMounted, watch, getCurrentInstance, inject } from 'vue'
import { useDisplay } from 'vuetify'
import { marked } from 'marked'
import { useAppStore } from '@/store/app'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()
const clipboard = inject('clipboard')
const store = useAppStore()
const { $ghost } = getCurrentInstance().appContext.config.globalProperties
const { smAndDown } = useDisplay()
const faqs = ref({})
const categories = ref([])
const origin = ref()

defineProps({
    msg: String,
})

marked.setOptions({
    mangle: false,
    headerIds: false,
    headerPrefix: false,
})
function formatBreadcrumbText(text) {
    if (!text) return
    const seperator = text.match(/[.&/]/)?.[0]

    return seperator
        ? text
            .split(seperator)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(` ${seperator} `)
        : text.charAt(0).toUpperCase() + text.slice(1)
}
const categoryBreadcrumbs = computed(() => {
    let mapped = categories.value?.length
        ? categories.value.map(categoryValue => ({
            name: categoryValue,
            title: formatBreadcrumbText(categoryValue),
            text: formatBreadcrumbText(categoryValue),
            to: `/faq?category=${encodeURIComponent(categoryValue)}`,
            disabled: route.query?.category !== categoryValue ? false : true,
            exact: true,
        }))
        : []
    return mapped
})
const getCategoryQuestions = async function () {
    categories.value?.length &&
        (await map(categories.value, async category => {
            let categoryFaqs = await $ghost.getFAQs(category)
            categoryFaqs = categoryFaqs.map(faq => {
                return {
                    id: faq.id,
                    question: faq.q,
                    answer: faq.a ? marked.parse(faq.a) : `We're still working on this question.  Please check back later.`,
                    image: faq.image,
                }
            })

            faqs.value = {
                ...faqs.value,
                [category]: categoryFaqs,
            }
        }))
}
const questionHeaderClass = open => {
    return {
        'font-weight-light': !open,
        'font-italic': open,
    }
}
const tooltip = ref(false)
function copyHandler(url) {
    clipboard.copy(url).then(copied => {
        tooltip.value = copied
        if (copied) {
            setTimeout(() => (tooltip.value = false), 1500)
        }
    })
}
async function update() {
    if (route.query?.category) {
        store.faq.category = categories.value?.findIndex(c => c === decodeURIComponent(route.query.category))
    }
    await getCategoryQuestions()
    if (route.query?.id) {
        store.faq.question = faqs.value[route.query?.category || 'general']?.findIndex(question => question.id === route.query.id)
    } else {
        store.faq.question = faqs.value[route.query?.category || 'general']?.[0]
    }
}
onMounted(() => {
    origin.value = document.location.origin
    new Promise(resolve =>
        $ghost.getMeta().then(async meta => {
            categories.value = Object.keys(meta.categories).map(category => {
                if (!faqs.value[category]) faqs.value[category] = []
                return category
            })
            update()
            resolve()
        })
    )
    watch(
        () => store.faq.category,
        value => categories.value[value] && router.replace(`/faq?category=${encodeURIComponent(categories.value[value])}`)
    )
    watch(
        () => route.query.category,
        value => {
            const index = categories.value?.findIndex(c => c === decodeURIComponent(value))
            if (index !== -1) {
                store.faq.category = index
            }
        }
    )
    watch(
        () => route.query.id,
        value => (store.faq.id = value)
    )
})
</script>
