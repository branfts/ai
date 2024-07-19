// Composables
import { createRouter, createWebHistory } from 'vue-router'

export default (app) => {
    const setupRoutes = $keycloak => {
        const { isAuthenticated, isLoading } = $keycloak

        return [
            {
                path: '/faq',
                name: 'faq',
                meta: {
                    title: 'Frequently Asked Questions',
                },
                component: () => import('@/views/FAQ.vue')
            }, {
                path: '/u/:username?',
                name: 'myindex',
                meta: {
                    title: 'My Index',
                },
                component: () => import('@/views/User.vue')
            }, {
                path: '/:catchAll(.*)',
                name: 'catchall',
                component: () => import('@/views/Home.vue')
            },
        ]
    }
    const router = createRouter({
        history: createWebHistory(process.env.BASE_URL),
        routes: setupRoutes(app.config.globalProperties.$keycloak),
    })

    app.use(router)
}
