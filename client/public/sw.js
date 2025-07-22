// Service Worker for FlowTrainer - Offline Functionality
const CACHE_NAME = 'flowtrainer-v1';
const API_CACHE_NAME = 'flowtrainer-api-v1';

// Files to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.svg',
  '/icon-512x512.svg'
];

// Runtime assets to cache on first load
const RUNTIME_CACHE_URLS = [
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/pages/Home.tsx',
  '/src/pages/Session.tsx',
  '/src/pages/EditWorkout.tsx',
  '/src/components/',
  '/src/hooks/',
  '/src/lib/'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Install complete');
        // Take control immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Install failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle API requests differently
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle navigation requests (pages)
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // Handle static assets
  event.respondWith(handleStaticRequest(request));
});

// Handle API requests with cache-first strategy for GET, network-only for others
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  // For GET requests, try cache first
  if (request.method === 'GET') {
    try {
      // Try network first for fresh data
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        // Cache successful responses
        cache.put(request, networkResponse.clone());
        return networkResponse;
      }
      throw new Error('Network response not ok');
    } catch (error) {
      // Fall back to cache if network fails
      console.log('Service Worker: Network failed, trying cache for API request');
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      // Return offline response for API
      return new Response(
        JSON.stringify({ 
          error: 'Offline', 
          message: 'This data is not available offline' 
        }),
        { 
          status: 503, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  }
  
  // For non-GET requests, always try network (POST, PUT, DELETE, etc.)
  try {
    return await fetch(request);
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'Cannot perform this action offline' 
      }),
      { 
        status: 503, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}

// Handle navigation requests (page loads)
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Fall back to cached index.html for SPA routing
    console.log('Service Worker: Network failed, serving cached index.html');
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match('/index.html');
    return cachedResponse || new Response('Offline - Please check your connection', { status: 503 });
  }
}

// Handle static assets with cache-first strategy
async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const url = new URL(request.url);
  
  try {
    // For development mode, always try network first for dynamic imports
    if (url.pathname.includes('/@') || url.pathname.includes('.vite/') || url.pathname.includes('node_modules')) {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        // Cache Vite assets for offline use
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }
    
    // Check cache first for static assets
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      // Serve from cache, but try to update in background
      fetch(request).then(response => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {});
      
      return cachedResponse;
    }
    
    // Fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      // Cache JavaScript, CSS, images, fonts, and Vite assets
      const isAsset = /\.(js|jsx|ts|tsx|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/.test(url.pathname) ||
                     url.pathname.includes('/src/') ||
                     url.pathname.includes('/@') ||
                     url.pathname.includes('.vite/');
      
      if (isAsset) {
        cache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Failed to fetch static asset', request.url);
    
    // Try to serve from cache if network fails
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return appropriate offline responses
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#ddd"/><text x="50" y="55" text-anchor="middle" fill="#666" font-size="12">Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    if (url.pathname.endsWith('.js') || url.pathname.endsWith('.tsx') || url.pathname.endsWith('.ts')) {
      return new Response('// Offline - unable to load module', 
        { headers: { 'Content-Type': 'application/javascript' } }
      );
    }
    
    if (url.pathname.endsWith('.css')) {
      return new Response('/* Offline - unable to load styles */', 
        { headers: { 'Content-Type': 'text/css' } }
      );
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    // Cache additional URLs on demand
    const urls = event.data.urls;
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urls);
    });
  }
});

// Periodic cache cleanup (optional)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupOldCaches());
  }
});

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name.startsWith('flowtrainer-') && 
    name !== CACHE_NAME && 
    name !== API_CACHE_NAME
  );
  
  return Promise.all(oldCaches.map(name => caches.delete(name)));
}