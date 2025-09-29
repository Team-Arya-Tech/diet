import { NextRequest, NextResponse } from "next/server"
import { getPatients, Patient } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    // Get patients from database
    const patients = getPatients()
    
    console.log("Patients found in database:", patients.length)
    
    // If no patients found, try to initialize sample data
    if (patients.length === 0) {
      console.log("No patients found, initializing sample data...")
      const { initializeSampleData } = await import("@/lib/database")
      initializeSampleData()
      
      // Try getting patients again after initialization
      const patientsAfterInit = getPatients()
      console.log("Patients after initialization:", patientsAfterInit.length)
      
      // Return simplified patient data for dropdown
      const patientList = patientsAfterInit.map((patient: Patient) => ({
        id: patient.id,
        name: patient.name,
        age: patient.age,
        constitution: patient.constitution,
        currentConditions: patient.currentConditions
      }))

      return NextResponse.json({
        success: true,
        patients: patientList,
        initialized: true
      })
    }
    
    // Return simplified patient data for dropdown
    const patientList = patients.map((patient: Patient) => ({
      id: patient.id,
      name: patient.name,
      age: patient.age,
      constitution: patient.constitution,
      currentConditions: patient.currentConditions
    }))

    return NextResponse.json({
      success: true,
      patients: patientList
    })
  } catch (error) {
    console.error("Error fetching patients:", error)
    return NextResponse.json(
      { error: "Failed to fetch patients", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}