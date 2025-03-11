// Import CACHE_VERSION
importScripts('./CACHE_VERSION.js');

// Import Workbox from the CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// Ensure Workbox is loaded before using it
if (workbox) {
    // Enable debugging during development
    workbox.setConfig({ debug: true });

    // Precache and route all assets using the global version
    workbox.precaching.precacheAndRoute([
        { url: '/', revision: CACHE_VERSION }, // Keep only the root path
        { url: '/manifest.json', revision: CACHE_VERSION },
        { url: '/assets/js/main.js', revision: CACHE_VERSION },
        { url: '/terms/index.html', revision: CACHE_VERSION },
        { url: '/privacy/index.html', revision: CACHE_VERSION },
        { url: '/service-details/index.html', revision: CACHE_VERSION },
        { url: '/portfolio-details/index.html', revision: CACHE_VERSION },
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
        { url: '/assets/img/logo.png', revision: CACHE_VERSION },
        { url: '/assets/img/apple-touch-icon.png', revision: CACHE_VERSION },
        { url: '/assets/img/android-chrome-192x192.png', revision: CACHE_VERSION },
        { url: '/assets/img/android-chrome-512x512.png', revision: CACHE_VERSION },
        { url: '/assets/img/maskable-icon.png', revision: CACHE_VERSION },
        { url: '/assets/img/hero-bg.jpg', revision: CACHE_VERSION },
        { url: '/assets/img/logopart1.png', revision: CACHE_VERSION },
        { url: '/assets/img/logopart2.png', revision: CACHE_VERSION },
        { url: '/assets/img/logopart3.png', revision: CACHE_VERSION },
        { url: '/assets/img/logopart4.png', revision: CACHE_VERSION },
        { url: '/assets/img/clients/1.png', revision: CACHE_VERSION },
        { url: '/assets/img/clients/2.png', revision: CACHE_VERSION },
        { url: '/assets/img/clients/3.png', revision: CACHE_VERSION },
        { url: '/assets/img/clients/4.png', revision: CACHE_VERSION },
        { url: '/assets/img/clients/5.png', revision: CACHE_VERSION },
        { url: '/assets/img/clients/6.png', revision: CACHE_VERSION },
        { url: '/assets/img/clients/7.png', revision: CACHE_VERSION },
        { url: '/assets/img/clients/8.png', revision: CACHE_VERSION },
        { url: '/assets/img/masonry-portfolio/id-card.jpg', revision: CACHE_VERSION },
        { url: '/assets/img/masonry-portfolio/icon.jpg', revision: CACHE_VERSION },
        { url: '/assets/img/masonry-portfolio/logo.jpg', revision: CACHE_VERSION },
        { url: '/assets/img/masonry-portfolio/visiting-card.png', revision: CACHE_VERSION },
        { url: '/assets/img/masonry-portfolio/visiting-card2.png', revision: CACHE_VERSION },
        { url: '/assets/img/masonry-portfolio/editing.jpg', revision: CACHE_VERSION },
        { url: '/assets/img/masonry-portfolio/editing2.jpg', revision: CACHE_VERSION },
        { url: '/assets/img/testimonials/testimonials-1.jpg', revision: CACHE_VERSION },
        { url: '/assets/img/testimonials/testimonials-2.jpg', revision: CACHE_VERSION },
        { url: '/assets/img/testimonials/testimonials-4.jpg', revision: CACHE_VERSION },
        { url: '/assets/img/testimonials/testimonials-5.jpg', revision: CACHE_VERSION },
        { url: '/assets/img/testimonials-bg.jpg', revision: CACHE_VERSION },
        { url: '/assets/img/cta-bg.jpg', revision: CACHE_VERSION },
        { url: '/assets/img/icon-192-maskable.png', revision: CACHE_VERSION },
        { url: '/assets/img/icon-192.png', revision: CACHE_VERSION },
        { url: '/assets/img/icon-512-maskable.png', revision: CACHE_VERSION },
        { url: '/assets/img/icon-512.png', revision: CACHE_VERSION }
    ]);

    // Force the service worker to take control immediately after installation
    self.addEventListener('install', (event) => {
        console.log('Service Worker installed.');
        self.skipWaiting(); // Activate the service worker immediately
    });

    // Claim all open clients (pages) for immediate control by the new service worker
    self.addEventListener('activate', (event) => {
        console.log('Service Worker activated.');
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

    console.log('Workbox is successfully loaded and configured.');
} else {
    console.error('Workbox failed to load. Ensure the CDN link is correct.');
}

// Listen for messages to handle version updates
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting(); // Skip waiting phase and activate immediately
    }
});
