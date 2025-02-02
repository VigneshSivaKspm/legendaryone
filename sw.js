// Ensure the script is running in the Service Worker context
if (typeof importScripts === 'function') {
    // Import Workbox from the CDN
    importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

    const CACHE_VERSION = 'v4.0.9';
    const CURRENT_CACHE = 'cache-' + CACHE_VERSION;

    // Ensure Workbox is loaded before using it
    if (workbox) {
        // Enable debugging during development
        workbox.setConfig({ debug: true });

        // Precache and route all assets using the global version
        workbox.precaching.precacheAndRoute([
            { url: '/', revision: CACHE_VERSION }, // Keep only the root path
            { url: '/manifest.json', revision: CACHE_VERSION },
            { url: '/assets/js/main.js', revision: CACHE_VERSION },
            { url: '/terms.html', revision: CACHE_VERSION },
            { url: '/privacy.html', revision: CACHE_VERSION },
            { url: '/service-details.html', revision: CACHE_VERSION },
            { url: '/project-details.html', revision: CACHE_VERSION },
            { url: '/sitemap.xml', revision: CACHE_VERSION },
            { url: '/assets/css/main.css', revision: CACHE_VERSION },
            { url: '/assets/vendor/bootstrap/css/bootstrap.min.css', revision: CACHE_VERSION },
            { url: '/assets/vendor/bootstrap/js/bootstrap.bundle.min.js', revision: CACHE_VERSION },
            { url: '/assets/vendor/aos/aos.css', revision: CACHE_VERSION },
            { url: '/assets/vendor/aos/aos.js', revision: CACHE_VERSION },
            { url: '/assets/vendor/swiper/swiper-bundle.min.css', revision: CACHE_VERSION },
            { url: '/assets/vendor/swiper/swiper-bundle.min.js', revision: CACHE_VERSION },
            { url: '/assets/vendor/glightbox/css/glightbox.min.css', revision: CACHE_VERSION },
            { url: '/assets/vendor/glightbox/js/glightbox.min.js', revision: CACHE_VERSION },
            { url: '/assets/vendor/imagesloaded/imagesloaded.pkgd.min.js', revision: CACHE_VERSION },
            { url: '/assets/vendor/isotope-layout/isotope.pkgd.min.js', revision: CACHE_VERSION },
            { url: '/assets/vendor/purecounter/purecounter_vanilla.js', revision: CACHE_VERSION },
            { url: '/assets/img/favicon.ico', revision: CACHE_VERSION },
            { url: '/assets/img/logo.svg', revision: CACHE_VERSION },
            { url: '/assets/img/logo-preload.svg', revision: CACHE_VERSION },
            { url: '/assets/img/apple-touch-icon.webp', revision: CACHE_VERSION },
            { url: '/assets/img/android-chrome-192x192.webp', revision: CACHE_VERSION },
            { url: '/assets/img/android-chrome-512x512.webp', revision: CACHE_VERSION },
            { url: '/assets/img/maskable-icon.webp', revision: CACHE_VERSION },
            { url: '/assets/img/hero-bg.webp', revision: CACHE_VERSION },
            { url: '/assets/img/logopart1.webp', revision: CACHE_VERSION },
            { url: '/assets/img/logopart2.webp', revision: CACHE_VERSION },
            { url: '/assets/img/logopart3.webp', revision: CACHE_VERSION },
            { url: '/assets/img/logopart4.webp', revision: CACHE_VERSION },
            { url: '/assets/img/clients/1.webp', revision: CACHE_VERSION },
            { url: '/assets/img/clients/2.webp', revision: CACHE_VERSION },
            { url: '/assets/img/clients/3.webp', revision: CACHE_VERSION },
            { url: '/assets/img/clients/4.webp', revision: CACHE_VERSION },
            { url: '/assets/img/clients/5.webp', revision: CACHE_VERSION },
            { url: '/assets/img/clients/6.webp', revision: CACHE_VERSION },
            { url: '/assets/img/clients/7.webp', revision: CACHE_VERSION },
            { url: '/assets/img/clients/8.webp', revision: CACHE_VERSION },
            { url: '/assets/img/masonry-portfolio/id-card.webp', revision: CACHE_VERSION },
            { url: '/assets/img/masonry-portfolio/icon.webp', revision: CACHE_VERSION },
            { url: '/assets/img/masonry-portfolio/logo.webp', revision: CACHE_VERSION },
            { url: '/assets/img/masonry-portfolio/visiting-card.webp', revision: CACHE_VERSION },
            { url: '/assets/img/masonry-portfolio/visiting-card2.webp', revision: CACHE_VERSION },
            { url: '/assets/img/masonry-portfolio/editing.webp', revision: CACHE_VERSION },
            { url: '/assets/img/masonry-portfolio/editing2.webp', revision: CACHE_VERSION },
            { url: '/assets/img/testimonials/testimonials-1.webp', revision: CACHE_VERSION },
            { url: '/assets/img/testimonials/testimonials-2.webp', revision: CACHE_VERSION },
            { url: '/assets/img/testimonials/testimonials-4.webp', revision: CACHE_VERSION },
            { url: '/assets/img/testimonials/testimonials-5.webp', revision: CACHE_VERSION },
            { url: '/assets/img/testimonials-bg.webp', revision: CACHE_VERSION },
            { url: '/assets/img/cta-bg.webp', revision: CACHE_VERSION },
            { url: '/assets/img/icon-192-maskable.webp', revision: CACHE_VERSION },
            { url: '/assets/img/icon-192.webp', revision: CACHE_VERSION },
            { url: '/assets/img/icon-512-maskable.webp', revision: CACHE_VERSION },
            { url: '/assets/img/icon-512.webp', revision: CACHE_VERSION }
        ]);

        // Force the service worker to take control immediately after installation
        self.addEventListener('install', (event) => {
            event.waitUntil(
                caches.keys().then(cacheNames => {
                    return Promise.all(
                        cacheNames.map(cacheName => {
                            if (cacheName !== CURRENT_CACHE) {
                                console.log('Deleting old cache:', cacheName);
                                return caches.delete(cacheName);
                            }
                        })
                    );
                }).then(() => {
                    self.skipWaiting(); // Activate the service worker immediately
                })
            );
        });

        // Claim all open clients (pages) for immediate control by the new service worker
        self.addEventListener('activate', (event) => {
            event.waitUntil(self.clients.claim());
        });

        // Add runtime caching for API requests
        workbox.routing.registerRoute(
            ({ url }) => url.origin.includes('api.example.com'),
            new workbox.strategies.NetworkFirst({
                cacheName: 'api-cache',
            })
        );

        // Runtime caching for images
        workbox.routing.registerRoute(
            ({ request }) => request.destination === 'image',
            new workbox.strategies.CacheFirst({
                cacheName: 'image-cache',
                plugins: [
                    new workbox.expiration.ExpirationPlugin({
                        maxEntries: 50,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                    })
                ]
            })
        );

    } else {
        console.error('Workbox failed to load. Ensure the CDN link is correct.');
    }

    // Listen for messages to handle version updates
    self.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
            self.skipWaiting(); // Skip waiting phase and activate immediately
        }
    });

}