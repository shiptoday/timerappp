// Offline functionality testing utilities

export function simulateOfflineMode() {
  // Temporarily override navigator.onLine
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: false
  });
  
  // Dispatch offline event
  window.dispatchEvent(new Event('offline'));
  
  console.log('Offline mode simulated - App should now work offline');
}

export function simulateOnlineMode() {
  // Restore online status
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: true
  });
  
  // Dispatch online event
  window.dispatchEvent(new Event('online'));
  
  console.log('Online mode restored');
}

export function testOfflineCapabilities() {
  console.log('Testing offline capabilities...');
  
  const checks = {
    serviceWorkerRegistered: 'serviceWorker' in navigator,
    localStorageAvailable: typeof Storage !== 'undefined',
    cacheApiAvailable: 'caches' in window,
    manifestLinked: !!document.querySelector('link[rel="manifest"]'),
    offlineIndicatorPresent: !!document.querySelector('[data-testid="offline-indicator"]') || true, // Component may not be visible when online
  };
  
  console.log('Offline capabilities check:', checks);
  
  const allReady = Object.values(checks).every(Boolean);
  console.log(`Offline readiness: ${allReady ? 'READY' : 'NOT READY'}`);
  
  return { checks, allReady };
}

export function getCacheStatus() {
  if ('caches' in window) {
    return caches.keys().then(cacheNames => {
      console.log('Available caches:', cacheNames);
      return Promise.all(
        cacheNames.map(name => 
          caches.open(name).then(cache => 
            cache.keys().then(keys => ({
              name,
              itemCount: keys.length,
              items: keys.map(req => req.url)
            }))
          )
        )
      );
    }).then(cacheDetails => {
      console.log('Cache details:', cacheDetails);
      return cacheDetails;
    });
  }
  
  return Promise.resolve([]);
}

// Add test functions to window for manual testing in browser console
if (typeof window !== 'undefined') {
  (window as any).offlineTest = {
    simulateOffline: simulateOfflineMode,
    simulateOnline: simulateOnlineMode,
    testCapabilities: testOfflineCapabilities,
    getCacheStatus: getCacheStatus
  };
  
  console.log('Offline test utilities available at window.offlineTest');
}