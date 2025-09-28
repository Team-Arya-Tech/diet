// Service Worker for PWA functionality
const CACHE_NAME = 'ahaarwise-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/offline.html',
  // Food database cache
  '/api/foods',
  '/api/recipes',
  // Essential images
  '/images/logo-192.png',
  '/images/logo-512.png',
  // Offline fallback pages
  '/patients',
  '/foods',
  '/recipes',
  '/reports'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  // Claim control of all clients
  self.clients.claim()
})

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response
        }
        
        return fetch(event.request).then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }
          
          // Clone the response
          const responseToCache = response.clone()
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })
          
          return response
        }).catch(() => {
          // Return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/offline.html')
          }
          
          // Return offline fallback for images
          if (event.request.destination === 'image') {
            return caches.match('/images/offline-fallback.png')
          }
        })
      })
  )
})

// Background sync for offline data submission
self.addEventListener('sync', (event) => {
  if (event.tag === 'patient-data-sync') {
    event.waitUntil(syncPatientData())
  } else if (event.tag === 'food-log-sync') {
    event.waitUntil(syncFoodLogs())
  } else if (event.tag === 'consultation-sync') {
    event.waitUntil(syncConsultations())
  }
})

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from AhaarWISE',
    icon: '/images/logo-192.png',
    badge: '/images/badge-72.png',
    vibrate: [200, 100, 200],
    tag: 'ahaarwise-notification',
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/images/action-open.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/action-close.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('AhaarWISE', options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Background fetch for large downloads
self.addEventListener('backgroundfetch', (event) => {
  if (event.tag === 'food-database-update') {
    event.waitUntil(
      self.registration.backgroundFetch.fetch(
        'food-database-update',
        '/api/foods/bulk-update',
        {
          icons: [{ src: '/images/logo-192.png', sizes: '192x192', type: 'image/png' }],
          title: 'Updating Food Database...',
          downloadTotal: 50 * 1024 * 1024 // 50MB estimate
        }
      )
    )
  }
})

// Utility functions for background sync
async function syncPatientData() {
  try {
    const unsyncedData = await getUnsyncedPatientData()
    
    for (const data of unsyncedData) {
      await fetch('/api/patients/sync', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      // Mark as synced in local storage
      await markDataAsSynced(data.id)
    }
  } catch (error) {
    console.error('Failed to sync patient data:', error)
    throw error
  }
}

async function syncFoodLogs() {
  try {
    const unsyncedLogs = await getUnsyncedFoodLogs()
    
    for (const log of unsyncedLogs) {
      await fetch('/api/food-logs/sync', {
        method: 'POST',
        body: JSON.stringify(log),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      await markLogAsSynced(log.id)
    }
  } catch (error) {
    console.error('Failed to sync food logs:', error)
    throw error
  }
}

async function syncConsultations() {
  try {
    const unsyncedConsultations = await getUnsyncedConsultations()
    
    for (const consultation of unsyncedConsultations) {
      await fetch('/api/consultations/sync', {
        method: 'POST',
        body: JSON.stringify(consultation),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      await markConsultationAsSynced(consultation.id)
    }
  } catch (error) {
    console.error('Failed to sync consultations:', error)
    throw error
  }
}

// IndexedDB operations for offline storage
async function getUnsyncedPatientData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AhaarWISE', 1)
    
    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(['patientData'], 'readonly')
      const store = transaction.objectStore('patientData')
      const index = store.index('synced')
      const query = index.getAll(false)
      
      query.onsuccess = () => resolve(query.result)
      query.onerror = () => reject(query.error)
    }
    
    request.onerror = () => reject(request.error)
  })
}

async function getUnsyncedFoodLogs() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AhaarWISE', 1)
    
    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(['foodLogs'], 'readonly')
      const store = transaction.objectStore('foodLogs')
      const index = store.index('synced')
      const query = index.getAll(false)
      
      query.onsuccess = () => resolve(query.result)
      query.onerror = () => reject(query.error)
    }
    
    request.onerror = () => reject(request.error)
  })
}

async function getUnsyncedConsultations() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AhaarWISE', 1)
    
    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(['consultations'], 'readonly')
      const store = transaction.objectStore('consultations')
      const index = store.index('synced')
      const query = index.getAll(false)
      
      query.onsuccess = () => resolve(query.result)
      query.onerror = () => reject(query.error)
    }
    
    request.onerror = () => reject(request.error)
  })
}

async function markDataAsSynced(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AhaarWISE', 1)
    
    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(['patientData'], 'readwrite')
      const store = transaction.objectStore('patientData')
      const getRequest = store.get(id)
      
      getRequest.onsuccess = () => {
        const data = getRequest.result
        data.synced = true
        data.lastSyncedAt = new Date().toISOString()
        
        store.put(data)
        resolve()
      }
      
      getRequest.onerror = () => reject(getRequest.error)
    }
    
    request.onerror = () => reject(request.error)
  })
}

async function markLogAsSynced(id) {
  return markDataAsSyncedInStore('foodLogs', id)
}

async function markConsultationAsSynced(id) {
  return markDataAsSyncedInStore('consultations', id)
}

async function markDataAsSyncedInStore(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AhaarWISE', 1)
    
    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const getRequest = store.get(id)
      
      getRequest.onsuccess = () => {
        const data = getRequest.result
        data.synced = true
        data.lastSyncedAt = new Date().toISOString()
        
        store.put(data)
        resolve()
      }
      
      getRequest.onerror = () => reject(getRequest.error)
    }
    
    request.onerror = () => reject(request.error)
  })
}