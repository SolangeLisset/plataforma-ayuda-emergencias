import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
                name: 'Ayuda Civil - Coordinación de Emergencia',
                short_name: 'Ayuda Civil',
                description: 'Plataforma de coordinación de ayuda ciudadana para emergencias.',
                theme_color: '#dc2626',
                icons: [
                    {
                        src: 'pwa-192.png', // I will just copy the same file for simplicity since I can't resize easily
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /\/api\/config/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-config-cache',
                            expiration: {
                                maxEntries: 1,
                                maxAgeSeconds: 60 * 60 * 24 // 24 hours
                            }
                        }
                    }
                ]
            }
        })
    ],
    server: {
        proxy: {
            '/api': 'http://localhost:5001',
            '/uploads': 'http://localhost:5001'
        }
    }
})
