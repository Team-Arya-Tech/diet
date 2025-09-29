"use client"

import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Filter,
  Users,
  Flame,
  Leaf,
  Target,
  Clock,
  Calendar,
  Sparkles,
  BookOpen,
  Download,
  FileText,
  UserPlus
} from 'lucide-react'
import { 
  ayurvedicExerciseService, 
  Exercise, 
  Constitution 
} from '@/lib/ayurvedic-exercises'
import { ExerciseGrid, ExerciseCard } from '@/components/ui/exercise-components'
import { generateExercisePDF } from '@/lib/exercise-pdf-export'
import { Patient, getPatients, initializeSampleData } from '@/lib/database'

function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedConstitution, setSelectedConstitution] = useState<Constitution | 'all'>('all')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [personalizedRoutine, setPersonalizedRoutine] = useState<Exercise[]>([])
  const [patientExercises, setPatientExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingPatients, setLoadingPatients] = useState(false)

  useEffect(() => {
    // Initialize sample data if needed
    try {
      initializeSampleData()
    } catch (error) {
      console.error("Error initializing sample data:", error)
    }
    
    const allExercises = ayurvedicExerciseService.getAllExercises()
    setExercises(allExercises)
    setFilteredExercises(allExercises)
    
      // Load patients directly from database
      const patientsData = getPatients()
      setPatients(patientsData)
    
    setLoading(false)
  }, [])

  const loadPatients = () => {
    setLoadingPatients(true)
    try {
      // Initialize sample data if needed
      initializeSampleData()
      
      // Load patients directly from database
      const patientsData = getPatients()
      setPatients(patientsData)
    } catch (error) {
      console.error('Error refreshing patients:', error)
    } finally {
      setLoadingPatients(false)
    }
  }

  const handleExportToPDF = async () => {
    if (!selectedPatient) {
      alert('Please select a patient first')
      return
    }

    try {
      const exercisesToExport = patientExercises.length > 0 ? patientExercises : filteredExercises.slice(0, 5)
      
      const recommendations = [
        'Practice regularly for best results',
        'Start slowly and gradually increase intensity',
        'Listen to your body and modify as needed',
        'Best practiced in the morning on an empty stomach'
      ]

      await generateExercisePDF({
        patient: selectedPatient,
        exercises: exercisesToExport,
        recommendations,
        title: `Personalized Exercise Plan for ${selectedPatient.name}`
      })
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  useEffect(() => {
    let filtered = exercises

    // Filter by search query
    if (searchQuery) {
      filtered = ayurvedicExerciseService.searchExercises(searchQuery)
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exercise => exercise.category === selectedCategory)
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(exercise => exercise.difficulty === selectedDifficulty)
    }

    // Filter by constitution suitability
    if (selectedConstitution !== 'all') {
      filtered = filtered.filter(exercise => 
        ayurvedicExerciseService.isExerciseSuitableForConstitution(exercise.id, selectedConstitution)
      )
    }

    setFilteredExercises(filtered)
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedConstitution, exercises])

  const generatePersonalizedRoutine = () => {
    if (selectedConstitution !== 'all') {
      const routine = ayurvedicExerciseService.getPersonalizedRoutine({
        constitution: selectedConstitution,
        season: getCurrentSeason(),
        timeOfDay: 'morning',
        duration: 30
      })
      setPersonalizedRoutine(routine)
    }
  }

  const generatePatientExercises = () => {
    if (selectedPatient) {
      const routine = ayurvedicExerciseService.getPersonalizedRoutine({
        constitution: selectedPatient.constitution as Constitution,
        season: getCurrentSeason(),
        timeOfDay: 'morning',
        duration: 45,
        goals: ['balance', 'flexibility', 'stress relief']
      })
      setPatientExercises(routine)
    }
  }

  const getCurrentSeason = () => {
    const month = new Date().getMonth()
    if (month >= 2 && month <= 4) return 'spring'
    if (month >= 5 && month <= 7) return 'summer'
    if (month >= 8 && month <= 10) return 'autumn'
    return 'winter'
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Asana': return <Users className="h-5 w-5" />
      case 'Pranayama': return <Flame className="h-5 w-5" />
      case 'Meditation': return <Leaf className="h-5 w-5" />
      default: return <Target className="h-5 w-5" />
    }
  }

  const getStatsForCategory = (category: string) => {
    return exercises.filter(ex => ex.category === category).length
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div 
        className="p-6 space-y-8 min-h-screen"
        style={{
          backgroundImage: 'url("/main_bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-amber-200">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Ayurvedic Exercises</h1>
            <p className="text-amber-700 mt-2">
              Traditional practices for body, mind, and spirit harmony
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm border-amber-300 text-amber-800">
              {exercises.length} Total Practices
            </Badge>
            <Badge variant="outline" className="text-sm border-amber-300 text-amber-800">
              4 Categories
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Asana', 'Pranayama', 'Meditation', 'Lifestyle'].map((category) => (
            <Card key={category} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    {getCategoryIcon(category)}
                  </div>
                  <div>
                    <p className="font-medium">{category}</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {getStatsForCategory(category)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="patient-based" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/90 backdrop-blur-sm">
            <TabsTrigger value="patient-based" className="flex items-center gap-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900">
              <Users className="h-4 w-4" />
              Patient Based
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center gap-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900">
              <BookOpen className="h-4 w-4" />
              Browse All
            </TabsTrigger>
            <TabsTrigger value="personalized" className="flex items-center gap-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900">
              <Sparkles className="h-4 w-4" />
              Personalized
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900">
              <Target className="h-4 w-4" />
              By Category
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patient-based" className="space-y-6">
            {/* Patient Selection */}
            <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <Users className="h-5 w-5" />
                  Patient-Based Exercise Recommendations
                </CardTitle>
                <CardDescription className="text-amber-700">
                  Select a patient to generate personalized exercise recommendations based on their constitution and health profile
                  {patients.length === 0 && !loadingPatients && (
                    <span className="block mt-2 text-sm">
                      No patients found. <a href="/patients" className="text-amber-600 hover:text-amber-800 underline">Add patients here</a> or use the refresh button to reload.
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Select 
                    value={selectedPatient?.id || ''} 
                    onValueChange={(patientId) => {
                      const patient = patients.find(p => p.id === patientId)
                      setSelectedPatient(patient || null)
                      setPatientExercises([])
                    }}
                  >
                    <SelectTrigger className="w-80 border-amber-300">
                      <SelectValue placeholder={
                        loadingPatients ? "Loading patients..." : 
                        patients.length === 0 ? "No patients found" : 
                        "Select a patient"
                      } />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 w-full min-w-[400px]">
                      {patients.length === 0 ? (
                        <div className="p-6 text-center space-y-3">
                          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                            <Users className="h-6 w-6 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium text-amber-900 mb-1">No patients found</p>
                            <p className="text-sm text-amber-700 mb-4">Add your first patient to get started</p>
                          </div>
                          <Button size="sm" asChild className="bg-amber-600 hover:bg-amber-700">
                            <a href="/patients/new">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Add New Patient
                            </a>
                          </Button>
                        </div>
                      ) : (
                        <>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id} className="p-4 h-16">
                              <div className="flex items-center justify-between w-full">
                                <div>
                                  <p className="font-semibold text-amber-900 text-base">{patient.name}</p>
                                  <p className="text-sm text-amber-700">
                                    {patient.constitution} • {patient.age}y • {patient.currentConditions.join(', ') || 'No conditions'}
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                          <Separator className="my-2" />
                          <div className="p-3">
                            <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                              <a href="/patients/new">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add New Patient
                              </a>
                            </Button>
                          </div>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={loadPatients}
                    disabled={loadingPatients}
                    variant="outline"
                    size="sm"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    {loadingPatients ? "Loading..." : "Refresh Patients"}
                  </Button>
                  <Button 
                    onClick={generatePatientExercises}
                    disabled={!selectedPatient}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate Exercises
                  </Button>
                  <Button 
                    onClick={handleExportToPDF}
                    disabled={!selectedPatient}
                    variant="outline"
                    className="flex items-center gap-2 border-amber-600 text-amber-700 hover:bg-amber-50"
                  >
                    <Download className="h-4 w-4" />
                    Export PDF
                  </Button>
                </div>

                {selectedPatient && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-medium text-amber-900 mb-2">Selected Patient Profile</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-amber-800">Name:</span>
                        <p className="text-amber-700">{selectedPatient.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-amber-800">Age:</span>
                        <p className="text-amber-700">{selectedPatient.age} years</p>
                      </div>
                      <div>
                        <span className="font-medium text-amber-800">Constitution:</span>
                        <p className="text-amber-700">{selectedPatient.constitution}</p>
                      </div>
                      <div>
                        <span className="font-medium text-amber-800">Health Focus:</span>
                        <p className="text-amber-700">{selectedPatient.medicalHistory?.join(', ') || 'General wellness'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedPatient && patients.length === 0 && (
                  <div className="text-center py-8 text-amber-600">
                    <Users className="h-12 w-12 mx-auto mb-4 text-amber-400" />
                    <p>No patients found. Add patients first to get personalized exercise recommendations.</p>
                  </div>
                )}

                {!selectedPatient && patients.length > 0 && (
                  <div className="text-center py-8 text-amber-600">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 text-amber-400" />
                    <p>Select a patient above to generate personalized exercise recommendations</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {patientExercises.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-amber-900">Recommended Exercises for {selectedPatient?.name}</h3>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                    {selectedPatient?.constitution} Constitution
                  </Badge>
                </div>
                <ExerciseGrid 
                  exercises={patientExercises} 
                  constitution={selectedPatient?.constitution}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <Filter className="h-5 w-5" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search exercises..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Category Filter */}
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Asana">Asana (Postures)</SelectItem>
                      <SelectItem value="Pranayama">Pranayama (Breathing)</SelectItem>
                      <SelectItem value="Meditation">Meditation</SelectItem>
                      <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Difficulty Filter */}
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Constitution Filter */}
                  <Select value={selectedConstitution} onValueChange={(value) => setSelectedConstitution(value as Constitution | 'all')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Constitution" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Constitutions</SelectItem>
                      <SelectItem value="vata">Vata</SelectItem>
                      <SelectItem value="pitta">Pitta</SelectItem>
                      <SelectItem value="kapha">Kapha</SelectItem>
                      <SelectItem value="vata-pitta">Vata-Pitta</SelectItem>
                      <SelectItem value="pitta-kapha">Pitta-Kapha</SelectItem>
                      <SelectItem value="vata-kapha">Vata-Kapha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-amber-700">
                    Showing {filteredExercises.length} of {exercises.length} exercises
                  </p>
                  {(searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all' || selectedConstitution !== 'all') && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-amber-300 text-amber-800 hover:bg-amber-50"
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedCategory('all')
                        setSelectedDifficulty('all')
                        setSelectedConstitution('all')
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Exercise Grid */}
            <ExerciseGrid 
              exercises={filteredExercises} 
              constitution={selectedConstitution !== 'all' ? selectedConstitution : undefined}
              emptyMessage="No exercises match your current filters. Try adjusting your search criteria."
            />
          </TabsContent>

          <TabsContent value="personalized" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <Sparkles className="h-5 w-5" />
                  Personalized Routine
                </CardTitle>
                <CardDescription className="text-amber-700">
                  Get a customized exercise routine based on Ayurvedic constitution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Select value={selectedConstitution} onValueChange={(value) => setSelectedConstitution(value as Constitution | 'all')}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select your constitution" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vata">Vata</SelectItem>
                      <SelectItem value="pitta">Pitta</SelectItem>
                      <SelectItem value="kapha">Kapha</SelectItem>
                      <SelectItem value="vata-pitta">Vata-Pitta</SelectItem>
                      <SelectItem value="pitta-kapha">Pitta-Kapha</SelectItem>
                      <SelectItem value="vata-kapha">Vata-Kapha</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={generatePersonalizedRoutine}
                    disabled={selectedConstitution === 'all'}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate Routine
                  </Button>
                </div>

                {selectedConstitution !== 'all' && personalizedRoutine.length === 0 && (
                  <div className="text-center py-8 text-amber-600">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 text-amber-400" />
                    <p>Click "Generate Routine" to create a personalized exercise plan</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {personalizedRoutine.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Your Personalized Routine</h3>
                  <Badge className="bg-orange-100 text-orange-800">
                    {selectedConstitution} Constitution
                  </Badge>
                </div>
                <ExerciseGrid 
                  exercises={personalizedRoutine} 
                  constitution={selectedConstitution !== 'all' ? selectedConstitution : undefined}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            {['Asana', 'Pranayama', 'Meditation'].map((category) => {
              const categoryExercises = ayurvedicExerciseService.getExercisesByCategory(category)
              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(category)}
                    <h3 className="text-xl font-semibold">{category}</h3>
                    <Badge variant="outline">{categoryExercises.length} practices</Badge>
                  </div>
                  <ExerciseGrid 
                    exercises={categoryExercises.slice(0, 6)} 
                    emptyMessage={`No ${category} practices available`}
                  />
                  {categoryExercises.length > 6 && (
                    <div className="text-center">
                      <Button variant="outline">
                        View All {category} Practices ({categoryExercises.length})
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default ExercisesPage