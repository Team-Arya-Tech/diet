"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Camera, 
  Upload, 
  Search, 
  Plus, 
  Minus,
  Save,
  Clock,
  Utensils,
  Zap,
  MapPin,
  Wifi,
  WifiOff,
  Smartphone,
  RotateCcw,
  ZapOff
} from 'lucide-react'
import { EnhancedFood, EnhancedFoodDatabase } from '@/lib/enhanced-food-database'

interface FoodLogEntry {
  id: string
  food: EnhancedFood
  quantity: number
  unit: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  timestamp: Date
  location?: string
  photo?: string
  notes?: string
  synced: boolean
}

interface CameraState {
  isActive: boolean
  stream: MediaStream | null
  facingMode: 'user' | 'environment'
  flashEnabled: boolean
  hasFlash: boolean
}

export function MobileFoodLogger() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [foodEntries, setFoodEntries] = useState<FoodLogEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<EnhancedFood[]>([])
  const [selectedFood, setSelectedFood] = useState<EnhancedFood | null>(null)
  const [quantity, setQuantity] = useState(100)
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch')
  const [notes, setNotes] = useState('')
  const [location, setLocation] = useState('')
  
  // Camera state
  const [camera, setCamera] = useState<CameraState>({
    isActive: false,
    stream: null,
    facingMode: 'environment',
    flashEnabled: false,
    hasFlash: false
  })
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Load saved entries from localStorage
  useEffect(() => {
    loadSavedEntries()
    getCurrentLocation()
  }, [])

  // Search foods as user types
  useEffect(() => {
    if (searchQuery.length > 2) {
      const results = EnhancedFoodDatabase.searchFoods({ text: searchQuery }).slice(0, 10)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const loadSavedEntries = () => {
    const saved = localStorage.getItem('mobile_food_entries')
    if (saved) {
      const entries = JSON.parse(saved)
      setFoodEntries(entries)
      
      // Schedule sync for unsynced entries if online
      if (isOnline) {
        syncUnsyncedEntries(entries.filter((e: FoodLogEntry) => !e.synced))
      }
    }
  }

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
        },
        (error) => {
          console.log('Location access denied:', error)
        }
      )
    }
  }

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: camera.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      // Check if device has flash
      const track = stream.getVideoTracks()[0]
      const capabilities = track.getCapabilities()
      const hasFlash = 'torch' in capabilities
      
      setCamera(prev => ({
        ...prev,
        isActive: true,
        stream,
        hasFlash
      }))
      
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Camera access denied. Please use file upload instead.')
    }
  }

  const stopCamera = () => {
    if (camera.stream) {
      camera.stream.getTracks().forEach(track => track.stop())
    }
    
    setCamera(prev => ({
      ...prev,
      isActive: false,
      stream: null
    }))
  }

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    context?.drawImage(video, 0, 0)
    
    return canvas.toDataURL('image/jpeg', 0.8)
  }, [])

  const toggleFlash = async () => {
    if (!camera.stream || !camera.hasFlash) return
    
    try {
      const track = camera.stream.getVideoTracks()[0]
      await track.applyConstraints({
        advanced: [{}]
      })
      
      setCamera(prev => ({
        ...prev,
        flashEnabled: !prev.flashEnabled
      }))
    } catch (error) {
      console.error('Error toggling flash:', error)
    }
  }

  const switchCamera = () => {
    stopCamera()
    setCamera(prev => ({
      ...prev,
      facingMode: prev.facingMode === 'user' ? 'environment' : 'user'
    }))
    // Restart camera with new facing mode
    setTimeout(startCamera, 100)
  }

  const handlePhotoCapture = () => {
    const photoData = capturePhoto()
    if (photoData) {
      // In a real app, you'd process this photo with AI for food recognition
      addFoodEntry(photoData)
      stopCamera()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const photoData = e.target?.result as string
        addFoodEntry(photoData)
      }
      reader.readAsDataURL(file)
    }
  }

  const addFoodEntry = (photo?: string) => {
    if (!selectedFood) {
      alert('Please select a food item first')
      return
    }
    
    const entry: FoodLogEntry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      food: selectedFood,
      quantity,
      unit: 'g',
      mealType,
      timestamp: new Date(),
      location: location || undefined,
      photo,
      notes: notes || undefined,
      synced: false
    }
    
    const updatedEntries = [...foodEntries, entry]
    setFoodEntries(updatedEntries)
    saveFoodEntries(updatedEntries)
    
    // Schedule background sync if online
    if (isOnline && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if ('sync' in registration) {
          (registration as any).sync.register('food-log-sync')
        }
      })
    }
    
    // Reset form
    setSelectedFood(null)
    setQuantity(100)
    setNotes('')
    setSearchQuery('')
  }

  const saveFoodEntries = (entries: FoodLogEntry[]) => {
    localStorage.setItem('mobile_food_entries', JSON.stringify(entries))
    
    // Also save to IndexedDB for better offline support
    if ('indexedDB' in window) {
      saveToIndexedDB(entries)
    }
  }

  const saveToIndexedDB = (entries: FoodLogEntry[]) => {
    const request = indexedDB.open('AhaarWISE', 1)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      
      if (!db.objectStoreNames.contains('foodLogs')) {
        const store = db.createObjectStore('foodLogs', { keyPath: 'id' })
        store.createIndex('synced', 'synced', { unique: false })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const transaction = db.transaction(['foodLogs'], 'readwrite')
      const store = transaction.objectStore('foodLogs')
      
      // Save the latest entry
      const latestEntry = entries[entries.length - 1]
      if (latestEntry) {
        store.put(latestEntry)
      }
    }
  }

  const syncUnsyncedEntries = async (unsyncedEntries: FoodLogEntry[]) => {
    for (const entry of unsyncedEntries) {
      try {
        // In a real app, this would sync to your backend API
        await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API call
        
        // Mark as synced
        const updatedEntries = foodEntries.map(e => 
          e.id === entry.id ? { ...e, synced: true } : e
        )
        setFoodEntries(updatedEntries)
        saveFoodEntries(updatedEntries)
        
      } catch (error) {
        console.error('Sync failed for entry:', entry.id, error)
      }
    }
  }

  const adjustQuantity = (delta: number) => {
    setQuantity(Math.max(10, quantity + delta))
  }

  const getTodayEntries = () => {
    const today = new Date().toDateString()
    return foodEntries.filter(entry => 
      new Date(entry.timestamp).toDateString() === today
    )
  }

  const calculateDayNutrition = () => {
    const todayEntries = getTodayEntries()
    const nutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }
    
    todayEntries.forEach(entry => {
      const multiplier = entry.quantity / 100 // Normalize to 100g
      nutrition.calories += entry.food.nutrition.calories * multiplier
      nutrition.protein += entry.food.nutrition.protein * multiplier
      nutrition.carbs += entry.food.nutrition.carbs * multiplier
      nutrition.fat += entry.food.nutrition.fat * multiplier
    })
    
    return nutrition
  }

  const unsyncedCount = foodEntries.filter(e => !e.synced).length
  const todayNutrition = calculateDayNutrition()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-20">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Food Logger</h1>
              <div className="flex items-center space-x-2 mt-1">
                {isOnline ? (
                  <div className="flex items-center text-green-600">
                    <Wifi className="w-4 h-4 mr-1" />
                    <span className="text-sm">Online</span>
                  </div>
                ) : (
                  <div className="flex items-center text-orange-600">
                    <WifiOff className="w-4 h-4 mr-1" />
                    <span className="text-sm">Offline</span>
                  </div>
                )}
                
                {unsyncedCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {unsyncedCount} unsynced
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {getTodayEntries().length} entries today
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Today's Nutrition Summary */}
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Today's Nutrition</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold">{Math.round(todayNutrition.calories)}</div>
                <div className="text-xs opacity-90">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{Math.round(todayNutrition.protein)}g</div>
                <div className="text-xs opacity-90">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{Math.round(todayNutrition.carbs)}g</div>
                <div className="text-xs opacity-90">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{Math.round(todayNutrition.fat)}g</div>
                <div className="text-xs opacity-90">Fat</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Food Search */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-600" />
              <span>Find Food</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for food (e.g., basmati rice, chicken)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
              <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
            
            {searchResults.length > 0 && (
              <div className="max-h-60 overflow-y-auto space-y-2">
                {searchResults.map(food => (
                  <div
                    key={food.id}
                    onClick={() => setSelectedFood(food)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedFood?.id === food.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{food.name}</div>
                        <div className="text-sm text-gray-600 capitalize">
                          {food.category} • {food.cuisine}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {food.nutrition.calories} cal/100g
                        </div>
                      </div>
                      {selectedFood?.id === food.id && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Food Details */}
        {selectedFood && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Log Food Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="font-medium text-blue-900">{selectedFood.name}</div>
                <div className="text-sm text-blue-700 mt-1">
                  {selectedFood.nutrition.calories} calories per 100g
                </div>
              </div>
              
              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adjustQuantity(-10)}
                    className="w-10 h-10 p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex-1 text-center">
                    <div className="text-xl font-bold">{quantity}g</div>
                    <div className="text-sm text-gray-600">
                      {Math.round(selectedFood.nutrition.calories * quantity / 100)} calories
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adjustQuantity(10)}
                    className="w-10 h-10 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Meal Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setMealType(type)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        mealType === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special notes about this meal..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Camera Controls */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Camera className="w-5 h-5 text-green-600" />
              <span>Add Photo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!camera.isActive ? (
              <div className="space-y-3">
                <Button
                  onClick={startCamera}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Take Photo
                </Button>
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full py-3"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload from Gallery
                </Button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 object-cover"
                  />
                  
                  <div className="absolute top-3 right-3 flex space-x-2">
                    {camera.hasFlash && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={toggleFlash}
                        className="w-10 h-10 p-0 bg-black/50 hover:bg-black/70"
                      >
                        {camera.flashEnabled ? (
                          <ZapOff className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <ZapOff className="w-4 h-4 text-white" />
                        )}
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={switchCamera}
                      className="w-10 h-10 p-0 bg-black/50 hover:bg-black/70"
                    >
                      <RotateCcw className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={handlePhotoCapture}
                    disabled={!selectedFood}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Capture & Log
                  </Button>
                  
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    className="px-6 py-3"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Entry Button */}
        {selectedFood && !camera.isActive && (
          <Button
            onClick={() => addFoodEntry()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-medium"
          >
            <Save className="w-5 h-5 mr-2" />
            Log Food Entry
          </Button>
        )}

        {/* Recent Entries */}
        {getTodayEntries().length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span>Today's Entries</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTodayEntries().reverse().slice(0, 5).map(entry => (
                  <div key={entry.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {entry.photo && (
                      <img
                        src={entry.photo}
                        alt="Food"
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{entry.food.name}</div>
                      <div className="text-sm text-gray-600">
                        {entry.quantity}g • {entry.mealType} • {new Date(entry.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {Math.round(entry.food.nutrition.calories * entry.quantity / 100)} cal
                      </div>
                      {!entry.synced && (
                        <Badge variant="outline" className="text-xs">
                          Unsynced
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}