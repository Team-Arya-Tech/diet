import { type Patient, type DietPlan, getPatientById } from "./database"
import { generateAIDietChart } from "./ai-diet-generator"

// This function wraps the OpenAI-powered diet chart generator
export async function generateAIDietChartWithOpenAI({ patientId, options }: { patientId: string, options?: any }): Promise<DietPlan | null> {
	const patient = getPatientById(patientId)
	if (!patient) throw new Error("Patient not found")
	return await generateAIDietChart(patient, options)
}
