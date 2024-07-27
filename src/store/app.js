import { defineStore } from "pinia"

const reset = {
    form: {
        name: undefined,
        names: [],
        links: [{
            url: ''
        }],
        rules: []
    }
}
export const useAppStore = defineStore("app", {
    state: () => ({
        faq: {},
        analytics: {
        },
        form: JSON.parse(JSON.stringify(reset.form)),
        stats: {},
        tour: {
            completed: undefined,
            canceled: undefined
        }
    }),
    actions: {
        resetForm(state) {
            state.form = JSON.parse(JSON.stringify(reset.form))
        },
    },
    persist: true
})
