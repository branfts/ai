<template>
    <v-container fluid>
        <qc-list v-if="user?.links" :user="user" />
        <span v-else>No data...</span>
        <qc-form />
    </v-container>
</template>
<style scoped></style>
<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import QcList from './QcList.vue'
import QcForm from './QcForm.vue'

const { MODE } = import.meta.env
const route = useRoute()
const user = ref({})

async function asyncInit() {
    const { username } = route.params

    try {
        const userConfig = username && await import(/* @vite-ignore */`/u/${route.params.username}.js`)
        const { links, rules } = userConfig

        // apply all of the rules we can now
        const redirectRule = rules.find(rule => rule.name === 'redirect')
        if (redirectRule) {
            const index = links.findIndex(link => link.href === redirectRule.href)
            if (index > -1) {
                links[index].redirect = redirectRule
            }
        }

        user.value = { username, links, rules, ...user.value }
    } catch (error) {
        console.error(error)
    }
}
asyncInit()
</script>