// Composables
import { createRouter, createWebHistory } from 'vue-router'

export default (app) => {
    const setupRoutes = $keycloak => {
        const { isAuthenticated, isLoading } = $keycloak

        return [
            {
                path: '/u/:username?',
                name: 'myindex',
                meta: {
                    title: 'My Index',
                    transition: 'animate__animated animate__bounceIn',
                },
                component: () => import('@/views/User.vue')
            }, {
                path: '/signout|/logout',
                name: 'signout',
                component: () => {
                    const urlParams = new URLSearchParams(window.location.search)
                    const redirectParam = urlParams.get('redirect')
                    const redirectUri = redirectParam || window.location.origin

                    $keycloak.value.logout({ redirectUri })
                }
            }, {
                path: '/signin|/login',
                name: 'signin',
                component: () => {
                    const urlParams = new URLSearchParams(window.location.search)
                    const redirectParam = urlParams.get('redirect')
                    const redirectUri = redirectParam || window.location.origin

                    $keycloak.value.login({ redirectUri })
                }
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
