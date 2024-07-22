import { defineStore } from "pinia"

export const useAppStore = defineStore("app", {
    state: () => ({
        faq: {},
        analytics: {
        },
        form: {
            name: undefined,
            names: [],
            links: [''],
            rules: []
        }
    }),
    persist: true,
})
