import fs from 'node:fs'
import { terser } from 'rollup-plugin-terser'
import viteCompression from 'vite-plugin-compression'

const cert = fs.existsSync('./localdev.crt') ? fs.readFileSync('./localdev.crt') : undefined
const key = fs.existsSync('./localdev.key') ? fs.readFileSync('./localdev.key') : undefined

// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: {
                transformAssetUrls,
                compilerOptions: {
                    isCustomElement: (tag) => /share-menu/.test(tag),
                }
            },
        }),
        // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
        vuetify({
            autoImport: true,
        }),
        viteCompression({
            algorithm: 'brotliCompress'
        }),
    ],
    define: { 'process.env': {} },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
        extensions: [
            '.js',
            '.json',
            '.jsx',
            '.mjs',
            '.ts',
            '.tsx',
            '.vue',
        ],
    },
    server: {
        port: 3017,
        https: {
            cert,
            key
        },
    },
    build: {
        minify: 'terser',
        rollupOptions: {
            plugins: [
                terser({
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                    },
                    mangle: true,
                }),
            ],
        },
    }
})
