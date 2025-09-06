import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EZ-Budget',
    short_name: 'EZBudget',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0d6efd',
    icons: [
      { src: '/icons/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/icons/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { src: '/icons/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    scope: '/',
    id: '/',
  }
}


