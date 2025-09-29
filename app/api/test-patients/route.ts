import { NextRequest, NextResponse } from "next/server"
import { initializeSampleData, getPatients } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    console.log("Test endpoint called")
    
    // Initialize sample data
    initializeSampleData()
    console.log("Sample data initialized")
    
    // Get patients after initialization
    const patients = getPatients()
    console.log("Patients after initialization:", patients.length)
    
    return NextResponse.json({
      success: true,
      message: "Sample data initialized",
      patientCount: patients.length,
      patients: patients.map(p => ({ id: p.id, name: p.name, constitution: p.constitution }))
    })
  } catch (error) {
    console.error("Error in test endpoint:", error)
    return NextResponse.json(
      { error: "Test failed", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}